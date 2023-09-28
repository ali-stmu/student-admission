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
        
            // Log::debug('Found student_id: ' . $student_id);
            
            // Return the data as a JSON response with key-value pairs
            return response()->json([
                'student_id' => $student_id,
                'first_name' => $First_name,
                'last_name' => $Last_name
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

    // Create an empty array to store program IDs
    $programIds = [];

    // Loop through the priorities array and find program IDs
    foreach ($priorities as $priority) {
        // Perform a database query to find the program ID based on the program name
        $program = DB::table('program')->where('program_name', $priority)->first();

        if ($program) {
            // If a program with the given name is found, store its program_id
            $programIds[] = $program->program_id;
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
            'application_status' => 'Pending',
            'application_date' => now(),
            'form_state' => 'Some Form State',
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
    // Return the array of priority names
    return response()->json(['priority_names' => $priorityNames], 200);
}

public function generatePdf(Request $request)
{
    try {
        $userId = $request->input('userID');
        $programFromClient = $request->input('program');

        $student_id_json = $this->findStudentId($userId);
        $studentId = $student_id_json->getData()->student_id;
        $first_name = $student_id_json->getData()->first_name;
        $last_name = $student_id_json->getData()->last_name;
        $Full_name =  $first_name . " " . $last_name;
        Log::debug($Full_name);
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
            $issueDate =  $application->updated_at->format('Y-m-d');;
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


        $data = [
            'collegeName' => $collegeName,
            'voucherID' => $term_id . $session_id . $bankIds . $studentId . $program_ID,
            'date' => $issueDate,
            'dueDate' => $dueDate,
            'AccountTitle' => $accountTitle,
            'bankAccountNumber' => $accountNumber,
            'programName' => $programFromClient,
            'studentName' => $Full_name,
            'pyear' => $term_name,
            'session' => $term_name,
            'totalAmount' => $amount,
            'uniLogo' => $fullpath,
            'bankLogo' => $bankLogoFullPath,
        ];


        $pdf = PDF::loadView('challan', compact('data'));

        return $pdf->download('challan.pdf');
    } catch (\Exception $e) {
        // Handle any exceptions here
        Log::error('An error occurred: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred'], 500);
    }
}

public function store(Request $request)
{
    Log::debug('Request data:', $request->all());
    $user_id = $request->input('userID');
    log::debug($user_id);
    $student_id_json = $this->findStudentId($user_id);
    $studentId = $student_id_json->getData()->student_id;
    $program = $request->input('priority');
    $program_model = null;

    if ($program) {
        $program_model = Program::where('program_name', $program)->first();
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
            'status' => 1,
            'bank_name' => $request->input('bankName'),
            'branch_code' => $request->input('bankName'),
            'transaction_id' => $request->input('bankName'),
            'mode_of_payment' => $request->input('modeOfPayment'),
        ]
    );

    // Return a success response or any necessary data
    return response()->json(['message' => 'Voucher saved successfully']);
}


}
