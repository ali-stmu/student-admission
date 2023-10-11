<?php

namespace App\Http\Controllers;
use App\Models\Admin;
use App\Models\Voucher;
use App\Models\Application;
use App\Models\student;
use App\Models\User;
use App\Models\education;
use App\Models\TestScore;
use App\Models\Session;
use App\Models\Term;
use App\Models\Bank;
use App\Models\College;
use App\Models\Program; // Import the Program model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminApplicationController extends Controller
{
    public function feeApplicationReceived(Request $request, $user_id)
    {
        try {
            // Use Eloquent to retrieve the admin details based on the user_id.
            $admin = Admin::where('user_id', $user_id)->first();

            if ($admin) {
                // Retrieve all programs where admin.college_id matches program.college_id
                if ($admin->college_id === 0) {
                    // If college_id is 0, gather all programs.
                    $programs = Program::all();
                } else {
                    // Retrieve all programs where admin.college_id matches program.college_id.
                    $programs = Program::where('college_id', $admin->college_id)->get();
                }
                if ($programs->isEmpty()) {
                    return response()->json(['message' => 'No programs found for this college'], 404);
                }
                log::debug($programs);

                // You can access the program data in $programs as needed.
                // For example, if you want to return the list of programs:
                $programData = $programs->toArray();

                $data = [
                    'programs' => $programData, // Add the programs data to the response.
                    // Add more attributes as needed.
                ];

                return response()->json($data);
            } else {
                // Admin not found for the given user_id.
                return response()->json(['message' => 'Admin not found'], 404);
            }
        } catch (\Exception $e) {
            // Handle any exceptions that might occur during the database query.
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred'], 500);
        }
    }
    public function ApplicantsfeeApplicationReceived(Request $request, $program_id)
{
    $vouchers = Voucher::where('program_id', $program_id)->get();

$applicantsData = [];
$voucherPath = storage_path('app/voucher_files/');

foreach ($vouchers as $voucher) {
    $studentId = $voucher->student_id;
    $programId = $voucher->program_id;
    $voucherID = $this->getVoucherId($studentId,$program_id);

    $studentInformation = Student::select('first_name', 'last_name', 'father_name', 'phone_number', 'student_id')
        ->where('student_id', $studentId)
        ->first();

    $intermediatePercentage = Education::select('percentage_criteria')
        ->where('student_id', $studentId)
        ->where('degree_id', 2)
        ->first();

    $testScorePercentage = TestScore::select('percentage')
        ->where('student_id', $studentId)
        ->first();

    // Concatenate the voucher file name with the voucher path
    $voucherFullPath = $voucherPath . $voucher->voucher_file_name;

    $applicantsData[] = [
        'student_information' => $studentInformation,
        'intermediate_percentage' => $intermediatePercentage,
        'test_score_percentage' => $testScorePercentage,
        'voucher_full_path' => $voucherFullPath, // Include the full voucher path
        'file_name' => $voucher->voucher_file_name, // Include the full voucher path
        'program_id' => $voucher->program_id, // Include the full voucher path
        'date' => date('d/m/Y', strtotime($voucher->created_at)),
        'voucherId' => $voucherID,
    ];
    log::debug($applicantsData);
}


return response()->json(['applicantsData' => $applicantsData]);
}


// Voucher ID

public function getVoucherId($studentId,$programId)
{
    try {
        $bankIds = "";
        $program_ID = "";
        $session_id = "";
        $term_id = "";
        $application = Application::where('student_id', $studentId)->first();

        if ($application) {
            $programIds = [
                $application->program_id_1,
                $application->program_id_2,
                $application->program_id_3,
                $application->program_id_4,
            ];

                if ($programIds) {
                    $program = Program::where('program_id', $programId)
                        ->where('status', '1')
                        ->first();
                    if ($program) {
                        $bankIds = $program->bank_id;                        
                        
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
                        }
                    }
                }
            
        }

        $voucherID = $term_id . $session_id . $bankIds . $studentId . $program_ID;

        return $voucherID;
    } catch (\Exception $e) {
        // Handle any exceptions here
        Log::error('An error occurred: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred'], 500);
    }
}







public function ApplicantsfeeApplicationVerified(Request $request, $program_id)
{
    $vouchers = Voucher::where('program_id', $program_id)->where('status', "Verified")->get();
    log::debug($vouchers);

$applicantsData = [];

foreach ($vouchers as $voucher) {
    $studentId = $voucher->student_id;
    $programId = $voucher->program_id;

    $studentInformation = Student::select('first_name', 'last_name', 'father_name', 'phone_number', 'student_id')
        ->where('student_id', $studentId)
        ->first();

    $intermediatePercentage = Education::select('percentage_criteria')
        ->where('student_id', $studentId)
        ->where('degree_id', 2)
        ->first();

    $testScorePercentage = TestScore::select('percentage')
        ->where('student_id', $studentId)
        ->first();

    // Concatenate the voucher file name with the voucher path

    $applicantsData[] = [
        'student_information' => $studentInformation,
        'intermediate_percentage' => $intermediatePercentage,
        'test_score_percentage' => $testScorePercentage,
        'date' => date('d/m/Y', strtotime($voucher->updated_at)),

    ];
    log::debug($applicantsData);
}


return response()->json(['applicantsData' => $applicantsData]);
}


public function ApplicantsfeeApplicationRejected(Request $request, $program_id)
{
    $vouchers = Voucher::where('program_id', $program_id)->where('status', "Rejected")->get();
    log::debug($vouchers);

$applicantsData = [];

foreach ($vouchers as $voucher) {
    $studentId = $voucher->student_id;
    $programId = $voucher->program_id;
    $remarks = $voucher->remarks;


    $studentInformation = Student::select('first_name', 'last_name', 'father_name', 'phone_number', 'student_id')
        ->where('student_id', $studentId)
        ->first();

    $intermediatePercentage = Education::select('percentage_criteria')
        ->where('student_id', $studentId)
        ->where('degree_id', 2)
        ->first();

    $testScorePercentage = TestScore::select('percentage')
        ->where('student_id', $studentId)
        ->first();

    // Concatenate the voucher file name with the voucher path

    $applicantsData[] = [
        'student_information' => $studentInformation,
        'intermediate_percentage' => $intermediatePercentage,
        'test_score_percentage' => $testScorePercentage,
        'remarks' => $remarks,
        'date' => date('d/m/Y', strtotime($voucher->updated_at)),

    ];
    log::debug($applicantsData);
}


return response()->json(['applicantsData' => $applicantsData]);
}

//pending wala
public function ApplicantsfeeApplicationPending(Request $request, $program_id)
{
    log::debug($program_id);
    $vouchers = Application::where('program_id_4', $program_id)
    ->orWhere('program_id_1', $program_id)
    ->orWhere('program_id_2', $program_id)
    ->orWhere('program_id_3', $program_id)
    ->get();
$applicantsData = [];
log::debug($vouchers);

foreach ($vouchers as $voucher) {
    $studentId = $voucher->student_id;

    $studentInformation = Student::select('first_name', 'last_name', 'father_name', 'phone_number')
        ->where('student_id', $studentId)
        ->first();

    $intermediatePercentage = Education::select('percentage_criteria')
        ->where('student_id', $studentId)
        ->where('degree_id', 2)
        ->first();

    $testScorePercentage = TestScore::select('percentage')
        ->where('student_id', $studentId)
        ->first();

    $applicantsData[] = [
        'student_information' => $studentInformation,
        'intermediate_percentage' => $intermediatePercentage,
        'test_score_percentage' => $testScorePercentage,
    ];
    log::debug($applicantsData);
}


return response()->json(['applicantsData' => $applicantsData]);
}



public function verifyApplication(Request $request)
{
    $studentId = $request->input('studentId');
    $programId = $request->input('programId');
    $userId = 0;
    $email = "";
    $programName = "";


    // Find the voucher to verify
    $student = Student::where('student_id', $studentId)->first();
    if ($student) {
        $userId = $student->user_id;
        $user = User::where('user_id', $userId)->first();
        $email = $user->email;
        log::debug($email);
    }
    $program = Program::where('program_id', $programId)
        ->first();
    if($program){
        $programName = $program->program_name;
    }

    $voucher = Voucher::where('program_id', $programId)
        ->where('student_id', $studentId)
        ->first();

    if (!$voucher) {
        return response()->json(['error' => 'Voucher not found'], 404);
    }

    // Update the voucher status to "verified"
    $voucher->status = 'Verified';
    $voucher->save();

    $VerificatonWithMessage = 'Dear Candidate,' . "\n\n" . 'Your Application for program' . " " . $programName . " " . "has been verified Successfully";
    Mail::raw(($VerificatonWithMessage), function ($message) use ($email) {
        $message->to($email);
        $message->subject('Verified Voucher');
    });

    return response()->json(['message' => 'Voucher verified successfully'], 200);
}

public function rejectApplication(Request $request)
{
    $studentId = $request->input('studentId');
    $programId = $request->input('programId');
    $rejectRemarks = $request->input('rejectRemarks');
    log::Debug($rejectRemarks);
    $userId = 0;
    $email = "";
    $programName = "";


    // Find the voucher to verify
    $student = Student::where('student_id', $studentId)->first();
    if ($student) {
        $userId = $student->user_id;
        $user = User::where('user_id', $userId)->first();
        $email = $user->email;
        log::debug($email);
    }
    $program = Program::where('program_id', $programId)
        ->first();
    if($program){
        $programName = $program->program_name;
    }

    $voucher = Voucher::where('program_id', $programId)
        ->where('student_id', $studentId)
        ->first();

    if (!$voucher) {
        return response()->json(['error' => 'Voucher not found'], 404);
    }

    // Update the voucher status to "verified"
    $voucher->status = 'Rejected';
    $voucher->remarks = $rejectRemarks;
    $voucher->save();

    $VerificatonWithMessage = 'Dear Candidate,' . "\n\n" . 'Your Application for program' . " " . $programName . " " . "has been Rejected due to" . " " . $rejectRemarks;
    Mail::raw(($VerificatonWithMessage), function ($message) use ($email) {
        $message->to($email);
        $message->subject('Rejected Voucher');
    });

    return response()->json(['message' => 'Voucher Rejected successfully'], 200);
}

public function getPdf($filename)
{
    $filePath = storage_path("app/voucher_files/{$filename}");

    if (file_exists($filePath)) {
        return response()->file($filePath);
    }

    return response()->json(['error' => 'File not found'], 404);
}




}
