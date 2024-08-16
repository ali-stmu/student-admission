<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\student;
use App\Models\Session;
use App\Models\Term;
use App\Models\Program;
use App\Models\Bank;
use App\Models\College;
use App\Models\Voucher;

use PDF;

class ApplicationController extends Controller
{

    public function findStudentId($user_id)
    {
        $student = Student::where('user_id', $user_id)->first();
        if ($student) {
            $student_id = $student->student_id;
            $First_name = $student->first_name;
            $Last_name = $student->last_name;
            $Middle_name = $student->middle_name;
        
            // Log::debug('Found student_id: ' . $student_id);
            
            // Return the data as a JSON response with key-value pairs
            return response()->json([
                'student_id' => $student_id,
                'first_name' => $First_name,
                'last_name' => $Last_name,
                'middle_name' => $Middle_name
            ]);
        } else {
            Log::debug('Student not found for user_id: ' . $user_id);
        }
        
    }
    public function savePriorities(Request $request)
{
    // Validate the incoming request data
    $request->validate([
        'user_id' => 'required|integer',
        'priorities' => 'required|array',
    ]);

    // Extract data from the request
    $user_id = $request->input('user_id');
    $priorities = $request->input('priorities');
    
    // Find the student's ID
    $student_id_json = $this->findStudentId($user_id);
    $studentId = $student_id_json->getData()->student_id;

    // Create arrays to store program IDs and session IDs
    $programIds = [];
    $sessionIds = [];

    // Loop through the priorities array and find program and session IDs
    foreach ($priorities as $priority) {
        // Perform a database query to find the program ID based on the program name
        $program = DB::table('program')->where('program_name', $priority)->first();

        if ($program) {
            // If a program with the given name is found, store its program_id
            $programIds[] = $program->program_id;

            // Find the session with matching program_id and status = 1
            $session = DB::table('sessions')
                        ->where('program_id', $program->program_id)
                        ->where('status', 1)
                        ->first();
                        
            if ($session) {
                // If a session with the given conditions is found, store its session_id
                $sessionIds[] = $session->session_id;
            } else {
                $sessionIds[] = null;
            }
        } else {
            $sessionIds[] = null;
        }
    }

    // Update or insert the Application record in the database
    Application::updateOrInsert(
        ['student_id' => $studentId],
        [
            'program_id_1' => $programIds[0] ?? null,
            'program_id_2' => $programIds[1] ?? null,
            'program_id_3' => $programIds[2] ?? null,
            'program_id_4' => $programIds[3] ?? null,
            'session_id_1' => $sessionIds[0] ?? null,
            'session_id_2' => $sessionIds[1] ?? null,
            'session_id_3' => $sessionIds[2] ?? null,
            'session_id_4' => $sessionIds[3] ?? null,
            'application_status' => 'Pending',
            'application_date' => now(),
            'form_state' => '..',
            'status' => 'Active',
        ]
    );

    // Return a response to the client
    return response()->json(['message' => 'Priorities saved successfully'], 200);
}

public function autofilPriority(Request $request)
{
    // Validate the incoming request data
    $request->validate([
        'user_id' => 'required|integer',
    ]);

    // Extract the user_id from the request
    $user_id = $request->input('user_id');

    // Find the student's ID
    $student_id_json = $this->findStudentId($user_id);
    $studentId = $student_id_json->getData()->student_id;

    // Initialize an array to store priority names
    $priorityNames = [];

    // Retrieve priorities from the Application model where the student ID matches
    $priorities = Application::where('student_id', $studentId)->first();

    if ($priorities) {
        // Loop through program_ids 1 to 4 and retrieve the corresponding program names
        for ($i = 1; $i <= 4; $i++) {
            $programId = $priorities->{'program_id_' . $i};
            if ($programId) {
                // Retrieve the program name based on program_id
                $program = Program::where('program_id', $programId)->first();
                if ($program) {
                    $priorityNames[] = $program->program_name;
                }
            }
        }
    }
    log::debug(response()->json(['priority_names' => $priorityNames], 200));
    // Return the array of priority names
    return response()->json(['priority_names' => $priorityNames], 200);
}
// Add this function before your generatePdf function
function amountInWords($amount) {
    $numberToWords = [
        0 => 'Zero',
        1 => 'One',
        2 => 'Two',
        3 => 'Three',
        4 => 'Four',
        5 => 'Five',
        6 => 'Six',
        7 => 'Seven',
        8 => 'Eight',
        9 => 'Nine',
        10 => 'Ten',
        11 => 'Eleven',
        12 => 'Twelve',
        13 => 'Thirteen',
        14 => 'Fourteen',
        15 => 'Fifteen',
        16 => 'Sixteen',
        17 => 'Seventeen',
        18 => 'Eighteen',
        19 => 'Nineteen',
        20 => 'Twenty',
        30 => 'Thirty',
        40 => 'Forty',
        50 => 'Fifty',
        60 => 'Sixty',
        70 => 'Seventy',
        80 => 'Eighty',
        90 => 'Ninety',
    ];

    if ($amount < 21) {
        return $numberToWords[$amount];
    }

    if ($amount < 100) {
        $tens = $numberToWords[10 * floor($amount / 10)];
        $ones = $numberToWords[$amount % 10];
        return $tens . ($ones ? ' ' . $ones : '');
    }

    if ($amount < 1000) {
        $hundreds = $numberToWords[floor($amount / 100)] . ' Hundred';
        $remainder = $amount % 100;

        if ($remainder === 0) {
            return $hundreds;
        }

        return $hundreds . ' and ' . $this->amountInWords($remainder);
    }

    if ($amount < 100000) {
        $thousands = $this->amountInWords(floor($amount / 1000)) . ' Thousand';
        $remainder = $amount % 1000;

        if ($remainder === 0) {
            return $thousands;
        }

        return $thousands . ' ' . $this->amountInWords($remainder);
    }

    return 'Amount too large to convert to words';
}

public function generatePdf(Request $request)
{
    try {
        $userId = $request->input('userID');
        $programFromClient = $request->input('program');

        $student_id_json = $this->findStudentId($userId);
        $studentData = $student_id_json->getData();
        
        $studentId = $studentData->student_id;
        $first_name = $studentData->first_name;
        $middle_name = $studentData->middle_name;
        $last_name = $studentData->last_name;
        
        $full_name = $first_name . " ";
        
        // Check if middle name is not null
        if (!empty($middle_name) || $middle_name != "null" || $middle_name != "-" || $middle_name != ".") {
            $full_name .= $last_name;
        }
        else{
        $full_name .= $middle_name . " " . $last_name;
        }
        
        
        Log::debug($full_name);
        
        // Initialize variables
        $programNames = "";
        $bankIds = "";
        $program_ID = "";
        $session_id = "";
        $term_id = "";
        $term_name = "";
        $amount = "";
        $dueDate = "";
        $issueDate = "";
        $bankName = "";
        $accountTitle = "";
        $accountNumber = "";
        $bankLogo = "";
        $collegeName = "";


        $application = Application::where('student_id', $studentId)->first();

        if ($application) {
            if ($application->updated_at !== null) {
                $issueDate = $application->updated_at->format('Y-m-d');
            }
            else{
                $issueDate =  $application->created_at->format('Y-m-d');
            }
           
            $programIds = [
                $application->program_id_1,
                $application->program_id_2,
                $application->program_id_3,
                $application->program_id_4,
            ];

            foreach ($programIds as $programId) {
                if ($programId) {
                    $program = Program::where('program_id', $programId)
                        ->where('program_name', $programFromClient)
                        ->where('status', '1')
                        ->first();
                    if ($program) {
                        $programNames = $program->program_name;
                        $bankIds = $program->bank_id;                        
                        if($bankIds){
                            $bank = Bank::where('bank_id', $bankIds)->first();
                            if($bank){
                                $bankName = $bank->bank_name;
                                $accountTitle = $bank->account_title;
                                $accountNumber = $bank->account_number;
                                $bankLogo = $bank->logo_path;
                            }
                        }
                        
                        $collegeID = $program->college_id;
                        if($collegeID){
                            $college = College::where('id',$collegeID)->first();
                            if($college){
                                $collegeName = $college->college_name;
                            }
                        }

                        $program_ID = $program->program_id;
                        $session = Session::where('program_id', $programId)
                            ->where('status', '1')
                            ->first();
                        if ($session) {
                            $session_id = $session->session_id;
                            $term_id = $session->term_id;
                            $amount = $session->amount;
                            if ($amount == 0) {
                                // Call the store function here
                                $this->storeFunction($studentId, $program_ID, $session_id, $term_id);
                                return response()->json(['message' => 'Amount is 0. Stored successfully.'], 201);
                            }
                            $dueDate = $session->due_date;
                             if ($issueDate > $dueDate) {
                                 return response()->json(['error' => 'Issue date cannot be smaller or earlier than due date'], 400);
                             }
                            $term = Term::where('term_id', $term_id)->first();
                            if ($term) {
                                $term_name = $term->term_name;
                            }
                        }
                    }
                }
            }
        }

        // Check if program names were found
        if (empty($programNames)) {
            // Handle the case where program names were not found
            return response()->json(['error' => 'Program names not found'], 404);
        }

        Log::debug($bankIds);
        Log::debug($programNames);
        Log::debug($program_ID);
        Log::debug($studentId);
        Log::debug($session_id);
        Log::debug($term_id);
        Log::debug($term_name);
        Log::debug($dueDate);
        // Now you have the program names in the $programNames array
        $fullpath = storage_path('app/bank_logo/ShifaLogo.png'); 
        $bankLogoFullPath = storage_path('app/bank_logo/'.$bankLogo);
        log::debug($bankLogoFullPath);
        $amountInWords = $this->amountInWords($amount);
        log::debug($amountInWords);

        $data = [
            'collegeName' => $collegeName,
            'voucherID' => $term_id . $session_id . $bankIds . $studentId . $program_ID,
            'date' => $issueDate,
            'dueDate' => $dueDate,
            'AccountTitle' => $accountTitle,
            'bankAccountNumber' => $accountNumber,
            'programName' => $programFromClient,
            'studentName' => $full_name,
            'pyear' => $term_name,
            'session' => $term_name,
            'totalAmount' => $amount,
            'uniLogo' => $fullpath,
            'bankLogo' => $bankLogoFullPath,
            'amountInWords' => $amountInWords." only",
        ];


        $pdf = PDF::loadView('challan', compact('data'));

        return $pdf->download('challan.pdf');
    } catch (\Exception $e) {
        // Handle any exceptions here
        Log::error('An error occurred: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred'], 500);
    }
}
private function storeFunction($studentId, $program_ID, $session_id, $term_id)
{
    try {
        // Update or create a Voucher instance with status "Verified" and application_status "Pending"
        Voucher::updateOrCreate(
            [
                'student_id' => $studentId,
                'program_id' => $program_ID,
            ],
            [
                'status' => 'Verified',
                'application_status' => 'Pending',
                'voucher_file_name' => 'null',
                'upload_date' => now(),
                'bank_name' => 'null',
                'branch_code' => 'null',
                'transaction_id' => 'null',
                'mode_of_payment' => 'null',
                // Add other fields as needed
            ]
        );

        Log::info('Voucher stored successfully with status Verified and application_status Pending.');

        // Find applications by student_id
        $applications = Application::where('student_id', $studentId)->get();

        // Iterate through the applications and nullify matching program IDs
        foreach ($applications as $application) {
            if ($application->program_id_1 == $program_ID) {
                $application->program_id_1 = null;
            }
            if ($application->program_id_2 == $program_ID) {
                $application->program_id_2 = null;
            }
            if ($application->program_id_3 == $program_ID) {
                $application->program_id_3 = null;
            }
            if ($application->program_id_4 == $program_ID) {
                $application->program_id_4 = null;
            }
            // Save the updated application
            $application->save();
        }

        Log::info('Application table updated successfully for student ID ' . $studentId);

        // Return a success response or any necessary data
        return response()->json(['message' => 'Voucher stored and application table updated successfully.']);
    } catch (\Exception $e) {
        // Handle any exceptions here
        Log::error('An error occurred while storing the voucher or updating the application: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while storing the voucher or updating the application.'], 500);
    }
}

public function store(Request $request)
{
    Log::debug('Request data:', $request->all());

    // Retrieve user ID and student ID
    $user_id = $request->input('userID');
    Log::debug($user_id);
    $student_id_json = $this->findStudentId($user_id);
    $studentId = $student_id_json->getData()->student_id;

    // Retrieve program information
    $program = $request->input('priority');
    $program_model = null;

    if ($program) {
        $program_model = Program::where('program_name', $program)->first();
    }

    // Retrieve session_id based on program_id and status = 1
    $session_id = null;
    if ($program_model) {
        $session = Session::where('program_id', $program_model->program_id)
                          ->where('status', 1)
                          ->first();
        if ($session) {
            $session_id = $session->session_id;
        }
    }

    // Handle file upload and generate a unique file name
    $voucherFileName = uniqid() . '.' . $request->file('challanAttachment')->getClientOriginalExtension();
    $request->file('challanAttachment')->storeAs('voucher_files', $voucherFileName);

    // Update or create a Voucher instance
    Voucher::updateOrCreate(
        [
            'student_id' => $studentId,
            'program_id' => optional($program_model)->program_id, // Use optional() to prevent errors if $program_model is null
        ],
        [
            'voucher_file_name' => $voucherFileName,
            'upload_date' => $request->input('challanPaidDate'),
            'status' => 'Pending',
            'application_status' => 'Pending',
            'bank_name' => $request->input('bankName'),
            'branch_code' => $request->input('branchCode'),
            'transaction_id' => $request->input('transactionID'),
            'mode_of_payment' => $request->input('modeOfPayment'),
            'session_id' => $session_id, // Add the session_id to the Voucher
        ]
    );

    // Update Application table to nullify matching program IDs
    if ($program_model) {
        $applications = Application::where('student_id', $studentId)->get();

        foreach ($applications as $application) {
            if ($application->program_id_1 == $program_model->program_id) {
                $application->program_id_1 = null;
            }
            if ($application->program_id_2 == $program_model->program_id) {
                $application->program_id_2 = null;
            }
            if ($application->program_id_3 == $program_model->program_id) {
                $application->program_id_3 = null;
            }
            if ($application->program_id_4 == $program_model->program_id) {
                $application->program_id_4 = null;
            }
            $application->save(); // Save changes to the application
        }
    }

    // Return a success response or any necessary data
    return response()->json(['message' => 'Voucher saved successfully and application updated']);
}



}
