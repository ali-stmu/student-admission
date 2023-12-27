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
use App\Models\Degree;
use App\Models\document;
use App\Models\College;
use App\Models\Program; // Import the Program model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use PDF; // Assuming you have Dompdf or any other PDF generation library installed

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
    $vouchers = Voucher::where('program_id', $program_id)->where('status', "Pending")->get();

    $applicantsData = [];
    $voucherPath = storage_path('app/voucher_files/');

    foreach ($vouchers as $voucher) {
        $studentId = $voucher->student_id;
        $programId = $voucher->program_id;
        $voucherID = $this->getVoucherId($studentId,$program_id);

    $userId = Student::select('user_id')
        ->where('student_id', $studentId)
        ->first();

        $userId = json_decode($userId, true);

        // Now you can access the 'user_id' key
        $user_id = $userId['user_id'];
        $cnic = User::select('cnic','email')->where('user_id', $user_id)->first();

    $studentInformation = Student::select('first_name', 'middle_name', 'last_name', 'father_name', 'phone_number', 'student_id')
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
        'cnic' => $cnic,

    ];
    //log::debug($applicantsData);
  }
 
  return response()->json(['applicantsData' => $applicantsData]);
}
public function feeReceivedExcel(Request $request, $program_id)
{
    // Retrieve applicant data using the ApplicantsfeeApplicationReceived function.
    $response = $this->ApplicantsfeeApplicationReceived($request, $program_id);
    $applicantsData = json_decode($response->getContent(), true);

    //log::debug($applicantsData);

    // Create a new spreadsheet
    $spreadsheet = new Spreadsheet();

    // Create a new worksheet
    $worksheet = $spreadsheet->getActiveSheet();

    // Define the column headers
    $headers = [
        'Full Name',
        'Father Name',
        'Phone Number',
        'Student ID',
        'Intermediate Percentage',
        'Test Score Percentage',
        'CNIC',
        'Email',
        'Voucher Id',
        'Date',
        // Add more headers as needed
    ];

    // Set the column headers
    $worksheet->fromArray([$headers], null, 'A1');

    // Extract and format the data from $applicantsData
    $data = [];
    foreach ($applicantsData['applicantsData'] as $applicant) {
        $data[] = [
            $applicant['student_information']['first_name']." ".$applicant['student_information']['last_name'],
            $applicant['student_information']['father_name'],
            $applicant['student_information']['phone_number'],
            $applicant['student_information']['student_id'],
            $applicant['intermediate_percentage']['percentage_criteria'],
            $applicant['test_score_percentage']['percentage'],
            $applicant['cnic']['cnic'],
            $applicant['cnic']['email'],
            $applicant['voucherId'],
            $applicant['date'],
            // Add more data fields as needed
        ];
    }

    // Set the data rows
    $worksheet->fromArray($data, null, 'A2');

    // Create a temporary file to save the spreadsheet
    $tempFilePath = tempnam(sys_get_temp_dir(), 'applicants_');
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($tempFilePath);

    // Return the Excel file as a response
    return response()->download($tempFilePath, 'applicants_Fee_Recieved.xlsx')->deleteFileAfterSend(true);
}


// public function feeReceivedPdf(Request $request, $program_id)
// {
//     // Retrieve applicant data using the ApplicantsfeeApplicationReceived function.
//     $response = $this->ApplicantsfeeApplicationReceived($request, $program_id);
//     $applicantsData = json_decode($response->getContent(), true);

//     log::debug($applicantsData);
//     // Create a new PDF instance
//     $pdf = PDF::loadView('pdf.applicantsFeeReceived', ['applicantsData' => $applicantsData]);

//     // Generate the PDF content
//     $pdfContent = $pdf->output();

//     // Save the PDF to a temporary file
//     $pdfFilePath = public_path('temp/applicants.pdf');
//     file_put_contents($pdfFilePath, $pdfContent);

//     // Return the PDF file path or you can return the PDF as a download
//     return response()->file($pdfFilePath);
// }

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


public function fetchAllStudentData($studentId, $programId)
{
    try {
        // Attempt to fetch the student data
        $student = Student::select('*')
            ->where('student_id', $studentId)
            ->first();

        if (!$student) {
            // If the student is not found, return an appropriate response
            return response()->json(['message' => 'Student not found'], 404);
        }
        $email = User::select('email')
            ->where('user_id' , $student->user_id)
            ->first();

        // Attempt to fetch education data with the related degree information
        $education = Education::where('student_id', $studentId)
            ->get();

        $educationData = [];

        foreach ($education as $eduRecord) {
            $degree = Degree::select('degree_name')
                ->where('degree_id', $eduRecord->degree_id)
                ->first();
            $document = document::select('document_file_path')
                ->where('degree_id', $eduRecord->degree_id)
                ->where('student_id', $studentId)
                ->first();
            
            if ($degree) {
                $eduRecord->degree_name = $degree->degree_name;
            } else {
                $eduRecord->degree_name = 'Unknown'; // Or another default value
            }
            if ($document) {
                $eduRecord->document_path = $document->document_file_path;
            } else {
                $eduRecord->degree_name = 'Unknown'; // Or another default value
            }

            $educationData[] = $eduRecord;
        }

        // Attempt to fetch test scores data
        $testScores = TestScore::where('student_id', $studentId)->get();

        $voucher = Voucher::where('student_id', $studentId)
            ->where('program_id', $programId)
            ->first();

        // Check if any of the data is missing
        if (empty($educationData) || !$testScores) {
            // Return an appropriate response for missing data
            return response()->json(['message' => 'Some data is missing'], 404);
        }

        // If all data is available, you can proceed to use it
        $studentData = $student;
        $testScoresData = $testScores;
        $voucherData = $voucher;
        

        // Return a success response with the data
        return response()->json([
            'studentData' => $studentData,
            'educationData' => $educationData,
            'testScoresData' => $testScoresData,
            'voucher' => $voucherData,
            'email' => $email,
        ], 200);
    } catch (\Exception $e) {
        // Handle any unexpected exceptions and return an error response
        return response()->json(['message' => 'An error occurred'], 500);
    }
}




public function ApplicantsfeeApplicationVerified(Request $request, $program_id)
{
    $vouchers = Voucher::where('program_id', $program_id)
    ->where('status', "Verified")
    ->where('application_status', "Pending")
    ->get();
    log::debug($vouchers);

$applicantsData = [];

foreach ($vouchers as $voucher) {
    $studentId = $voucher->student_id;
    $programId = $voucher->program_id;
    $voucherID = $this->getVoucherId($studentId,$program_id);
    $userId = Student::select('user_id')
    ->where('student_id', $studentId)
    ->first();

    $userId = json_decode($userId, true);

    // Now you can access the 'user_id' key
    $user_id = $userId['user_id'];
    $cnic = User::select('cnic','email')->where('user_id', $user_id)->first();

    $studentInformation = Student::select('first_name', 'middle_name', 'last_name', 'father_name', 'phone_number', 'student_id')
        ->where('student_id', $studentId)
        ->first();

    $intermediatePercentage = Education::select('percentage_criteria')
        ->where('student_id', $studentId)
        ->where('degree_id', 2)
        ->first();

    $matricPercentage = Education::select('percentage_criteria')
        ->where('student_id', $studentId)
        ->where('degree_id', 1)
        ->first();
            

    $testScorePercentage = TestScore::select('percentage')
        ->where('student_id', $studentId)
        ->first();

    // Concatenate the voucher file name with the voucher path

    $applicantsData[] = [
        'student_information' => $studentInformation,
        'intermediate_percentage' => $intermediatePercentage,
        'matric_percentage' => $intermediatePercentage,
        'test_score_percentage' => $testScorePercentage,
        'date' => date('d/m/Y', strtotime($voucher->updated_at)),
        'voucherId' => $voucherID,
        'cnic' => $cnic,

    ];
    //log::debug($applicantsData);
}

return response()->json(['applicantsData' => $applicantsData]);
}



public function ApplicantsApplicationVerified(Request $request, $program_id)
{
    $vouchers = Voucher::where('program_id', $program_id)
    ->where('application_status', "Verified")
    ->where('status', "Verified")
    ->get();
    //log::debug($vouchers);

$applicantsData = [];

foreach ($vouchers as $voucher) {
    $studentId = $voucher->student_id;
    $programId = $voucher->program_id;
    $voucherID = $this->getVoucherId($studentId,$program_id);
    $userId = Student::select('user_id')
    ->where('student_id', $studentId)
    ->first();

    $userId = json_decode($userId, true);

    // Now you can access the 'user_id' key
    $user_id = $userId['user_id'];
    $cnic = User::select('cnic','email')->where('user_id', $user_id)->first();

    $studentInformation = Student::select('first_name', 'middle_name', 'last_name', 'father_name', 'phone_number', 'student_id','gender','date_of_birth','address')
        ->where('student_id', $studentId)
        ->first();

    $intermediatePercentage = Education::select('percentage_criteria','total_marks','obtained_marks','institution_name')
        ->where('student_id', $studentId)
        ->where('degree_id', 2)
        ->first();
    $matricPercentage = Education::select('percentage_criteria','total_marks','obtained_marks','institution_name')
        ->where('student_id', $studentId)
        ->where('degree_id', 1)
        ->first();

    $testScorePercentage = TestScore::select('percentage','test_score','test_score_total','test_date','test_reg_no')
        ->where('student_id', $studentId)
        ->first();

    // Concatenate the voucher file name with the voucher path

    $applicantsData[] = [
        'student_information' => $studentInformation,
        'intermediate_percentage' => $intermediatePercentage->percentage_criteria,
        'intermediate_total' => $intermediatePercentage->total_marks,
        'intermediate_obtained' => $intermediatePercentage->obtained_marks,
        'intermediate_board' => $intermediatePercentage->institution_name,


        'matric_percentage' => $matricPercentage->percentage_criteria,
        'matric_total' => $matricPercentage->total_marks,
        'matric_obtained' => $matricPercentage->obtained_marks,
        'matric_board' => $matricPercentage->institution_name,


        'test_score_percentage' => $testScorePercentage->percentage,
        'test_score_total' => $testScorePercentage->test_score_total,
        'test_score_obtained' => $testScorePercentage->test_score,
        'test_score_year' => $testScorePercentage->test_date,
        'test_score_roll_no' => $testScorePercentage->test_reg_no,



        'date' => date('d/m/Y', strtotime($voucher->updated_at)),
        'voucherId' => $voucherID,
        'cnic' => $cnic,

    ];
    //log::debug($applicantsData);
}

return response()->json(['applicantsData' => $applicantsData]);
}


public function ApplicantsfeeApplicationRejected(Request $request, $program_id)
{
    $vouchers = Voucher::where('program_id', $program_id)
    ->where('status', "Rejected")
    ->where('application_status', "Pending")
    ->get();
    log::debug($vouchers);

$applicantsData = [];

foreach ($vouchers as $voucher) {
    $studentId = $voucher->student_id;
    $programId = $voucher->program_id;
    $remarks = $voucher->remarks;
    $voucherID = $this->getVoucherId($studentId,$program_id);
    $userId = Student::select('user_id')
    ->where('student_id', $studentId)
    ->first();

    $userId = json_decode($userId, true);

    // Now you can access the 'user_id' key
    $user_id = $userId['user_id'];
    $cnic = User::select('cnic','email')->where('user_id', $user_id)->first();



    $studentInformation = Student::select('first_name', 'middle_name', 'last_name', 'father_name', 'phone_number', 'student_id')
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
        'file_name' => $voucher->voucher_file_name,
        'date' => date('d/m/Y', strtotime($voucher->updated_at)),
        'voucherId' => $voucherID,
        'cnic'=> $cnic,


    ];
    //log::debug($applicantsData);
}




return response()->json(['applicantsData' => $applicantsData]);
}


public function ApplicantsApplicationRejected(Request $request, $program_id)
{
    $vouchers = Voucher::where('program_id', $program_id)->where('application_status', "Rejected")->get();
    log::debug($vouchers);

$applicantsData = [];

foreach ($vouchers as $voucher) {
    $studentId = $voucher->student_id;
    $programId = $voucher->program_id;
    $remarks = $voucher->remarks;
    $voucherID = $this->getVoucherId($studentId,$program_id);
    $userId = Student::select('user_id')
    ->where('student_id', $studentId)
    ->first();

    $userId = json_decode($userId, true);

    // Now you can access the 'user_id' key
    $user_id = $userId['user_id'];
    $cnic = User::select('cnic','email')->where('user_id', $user_id)->first();



    $studentInformation = Student::select('first_name', 'middle_name', 'last_name', 'father_name', 'phone_number', 'student_id')
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
        'voucherId' => $voucherID,
        'cnic'=> $cnic,


    ];
    //log::debug($applicantsData);
}




return response()->json(['applicantsData' => $applicantsData]);
}




//pending wala
public function ApplicantsfeeApplicationPending(Request $request, $program_id)
{
    log::debug($program_id);
$applications = Application::where('program_id_4', $program_id)
    ->orWhere('program_id_1', $program_id)
    ->orWhere('program_id_2', $program_id)
    ->orWhere('program_id_3', $program_id)
    ->get();

$applicantsData = [];
log::debug($applications);

foreach ($applications as $application) {
    $studentId = $application->student_id;

    // Check if the student_id exists in voucher.student_id
    $voucherExists = Voucher::where('student_id', $studentId)->exists();

    if (!$voucherExists) {
        $userId = Student::select('user_id')
            ->where('student_id', $studentId)
            ->first();

        $userId = json_decode($userId, true);

        // Now you can access the 'user_id' key
        $user_id = $userId['user_id'];
        $userData = User::select('email', 'cnic')->where('user_id', $user_id)->first();


        $studentInformation = Student::select('first_name', 'middle_name', 'last_name', 'father_name', 'phone_number', 'student_id')
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
            'cnic' => $userData->cnic,
            'email' => $userData->email,
        ];
    }
    //log::debug($applicantsData);
}

return response()->json(['applicantsData' => $applicantsData]);

}


public function feePendingExcel(Request $request, $program_id)
{
    // Retrieve applicant data using the ApplicantsfeeApplicationReceived function.
    $response = $this->ApplicantsfeeApplicationPending($request, $program_id);
    $applicantsData = json_decode($response->getContent(), true);

    //log::debug($applicantsData);

    // Create a new spreadsheet
    $spreadsheet = new Spreadsheet();

    // Create a new worksheet
    $worksheet = $spreadsheet->getActiveSheet();

    // Define the column headers
    $headers = [
        'Full Name',
        'Father Name',
        'Phone Number',
        'Intermediate Percentage',
        'Test Score Percentage',
        'CNIC',
        'Email',


        // Add more headers as needed
    ];

    // Set the column headers
    $worksheet->fromArray([$headers], null, 'A1');

    // Extract and format the data from $applicantsData
    $data = [];
    foreach ($applicantsData['applicantsData'] as $applicant) {
        $data[] = [
            $applicant['student_information']['first_name'] ?? '', // Use an empty string if null
            $applicant['student_information']['last_name'] ?? '',  // Use an empty string if null
            $applicant['student_information']['father_name'] ?? '',
            $applicant['student_information']['phone_number'] ?? '',
            $applicant['intermediate_percentage']['percentage_criteria'] ?? '',
            $applicant['test_score_percentage']['percentage'] ?? '',
            $applicant['cnic'] ?? '',
            $applicant['email'] ?? '',
            // Add more data fields as needed
        ];
    }

    // Set the data rows
    $worksheet->fromArray($data, null, 'A2');

    // Create a temporary file to save the spreadsheet
    $tempFilePath = tempnam(sys_get_temp_dir(), 'applicants_');
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($tempFilePath);

    // Return the Excel file as a response
    return response()->download($tempFilePath, 'applicants_Fee_Recieved.xlsx')->deleteFileAfterSend(true);
}




public function feeVerifiedExcel(Request $request, $program_id)
{
    $response = $this->ApplicantsfeeApplicationVerified($request, $program_id);
    $applicantsData = json_decode($response->getContent(), true);

    //log::debug($applicantsData);

    // Create a new spreadsheet
    $spreadsheet = new Spreadsheet();

    // Create a new worksheet
    $worksheet = $spreadsheet->getActiveSheet();

    // Define the column headers
    $headers = [
        'Full Name',
        'Father Name',
        'Phone Number',
        'Student ID',
        'Intermediate Percentage',
        'Matric Percentage',
        'Test Score Percentage',
        'CNIC',
        'Email',

        'Voucher Id',
        'Date',
        'Aggregate',

        // Add more headers as needed
    ];

    // Set the column headers
    $worksheet->fromArray([$headers], null, 'A1');

    // Extract and format the data from $applicantsData
  // Extract and format the data from $applicantsData
$data = [];
foreach ($applicantsData['applicantsData'] as $applicant) {
    $fullName = isset($applicant['student_information']['first_name']) ? $applicant['student_information']['first_name']." ".$applicant['student_information']['last_name'] : '';
    $fatherName = $applicant['student_information']['father_name'] ?? '';
    $phoneNumber = $applicant['student_information']['phone_number'] ?? '';
    $studentId = $applicant['student_information']['student_id'] ?? '';
    $intermediatePercentage = $applicant['intermediate_percentage']['percentage_criteria'] ?? '';
    $matricPercentage = $applicant['matric_percentage']['percentage_criteria'] ?? '';
    $testScorePercentage = $applicant['test_score_percentage']['percentage'] ?? '';
    $cnic = $applicant['cnic']['cnic'] ?? '';
    $email = $applicant['cnic']['email'] ?? '';
    $voucherId = $applicant['voucherId'] ?? '';
    $date = $applicant['date'] ?? '';
    $aggregate = ($testScorePercentage * 0.5) +
    ($intermediatePercentage * 0.4) +
    ($matricPercentage * 0.1);

    $data[] = [
        $fullName,
        $fatherName,
        $phoneNumber,
        $studentId,
        $intermediatePercentage,
        $matricPercentage,
        $testScorePercentage,
        $cnic,
        $email,
        $voucherId,
        $date,
        $aggregate,
        // Add more data fields as needed
    ];
}

    // Set the data rows
    $worksheet->fromArray($data, null, 'A2');

    // Create a temporary file to save the spreadsheet
    $tempFilePath = tempnam(sys_get_temp_dir(), 'applicants_');
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($tempFilePath);

    // Return the Excel file as a response
    return response()->download($tempFilePath, 'applicants_Fee_Recieved.xlsx')->deleteFileAfterSend(true);
}




public function appVerifiedExcel(Request $request, $program_id)
{
    $response = $this->ApplicantsApplicationVerified($request, $program_id);
    $applicantsData = json_decode($response->getContent(), true);
    //log::debug($applicantsData);

    // Create a new spreadsheet
    $spreadsheet = new Spreadsheet();

    // Create a new worksheet
    $worksheet = $spreadsheet->getActiveSheet();

    // Define the column headers
    $headers = [
        'Full Name',
        'Father Name',
        'Phone Number',
        'Student ID',
        'Intermediate Percentage',
        'Test Score Percentage',
        'CNIC',
        'Voucher Id',
        'Date',
        // Add more headers as needed
    ];

    // Set the column headers
    $worksheet->fromArray([$headers], null, 'A1');

    // Extract and format the data from $applicantsData
    $data = [];
    foreach ($applicantsData['applicantsData'] as $applicant) {
        $data[] = [
            $applicant['student_information']['first_name']." ".$applicant['student_information']['last_name'],
            $applicant['student_information']['father_name'],
            $applicant['student_information']['phone_number'],
            $applicant['student_information']['student_id'],
            $applicant['intermediate_percentage'],
            $applicant['test_score_percentage'],
            $applicant['cnic']['cnic'],
            $applicant['voucherId'],
            $applicant['date'],
            // Add more data fields as needed
        ];
    }

    // Set the data rows
    $worksheet->fromArray($data, null, 'A2');

    // Create a temporary file to save the spreadsheet
    $tempFilePath = tempnam(sys_get_temp_dir(), 'applicants_');
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($tempFilePath);

    // Return the Excel file as a response
    return response()->download($tempFilePath, 'applicants_Fee_Received.xlsx')->deleteFileAfterSend(true);
}



public function appVerifiedMeritList(Request $request, $program_id)
{
    $response = $this->ApplicantsApplicationVerified($request, $program_id);
    $applicantsData = json_decode($response->getContent(), true);

    // Create a new spreadsheet
    $spreadsheet = new Spreadsheet();

    // Create a new worksheet
    $worksheet = $spreadsheet->getActiveSheet();

    // Define the column headers
    $headers = [
        'Application No',
        'Student Name',
        'Father Name',
        'CNIC',
        'Gender',
        'Date of Birth',
        'Address',
        'Contact Number',
        'Email',
        'SSC/IBCC Equivalence Board name',
        'SSC/IBCC Equivalence Total Marks',
        'SSC/IBCC Equivalence Marks Obtained',
        'SSC Obtained Weightage (10%)',
        'HSSC/IBCC Equivalence Board name',
        'HSSC/IBCC Equivalence Total Marks',
        'HSSC/IBCC Equivalence Obtained Marks',
        'Obtained Weightage (40%)',
        'MDCAT Year',
        'MDCAT Roll No',
        'MDCAT / Sat- II / MCAT / UCAT Total Marks',
        'MDCAT / Sat- II / MCAT / UCAT Obtained Marks',
        'MDCAT / Sat- II / MCAT / UCAT Obtained Weightage (50%)',
        'Date',
        'Total Aggregate', // New column for aggregate
        'Merit Standing',
    ];

    // Set the column headers
    $worksheet->fromArray([$headers], null, 'A1');

    // Extract and format the data from $applicantsData
    $data = [];
    $meritPosition = 1; // Initialize merit position counter
    foreach ($applicantsData['applicantsData'] as $applicant) {
        $voucherId = $applicant['voucherId'] ?? '';

        // Handle null values in the percentage criteria
        $testScorePercentage = $applicant['test_score_percentage'] ?? 0;
        $testScoreTotal = $applicant['test_score_total'] ?? 0;
        $testScoreObtained = $applicant['test_score_obtained'] ?? 0;

        $intermediatePercentage = $applicant['intermediate_percentage'] ?? 0;
        $intermediateObtained = $applicant['intermediate_obtained'] ?? 0;
        $intermediateTotal = $applicant['intermediate_total'] ?? 0;

        $matricPercentage = $applicant['matric_percentage'] ?? 0;
        $matricTotal = $applicant['matric_total'] ?? 0;
        $matricObtained = $applicant['matric_obtained'] ?? 0;



        // Calculate the aggregate, handling null values
        $aggregate = ($testScorePercentage * 0.5) +
                     ($intermediatePercentage * 0.4) +
                     ($matricPercentage * 0.1);

        // Handle null values in other fields
        $fullName = $applicant['student_information']['first_name'] . " " .
                    $applicant['student_information']['last_name'];
        $fatherName = $applicant['student_information']['father_name'] ?? '';
        $phoneNumber = $applicant['student_information']['phone_number'] ?? '';
        $studentId = $applicant['student_information']['student_id'] ?? '';
        $cnic = $applicant['cnic']['cnic'] ?? '';
        $email = $applicant['cnic']['email'] ?? '';

        $voucherId = $applicant['voucherId'] ?? '';
        $date = $applicant['date'] ?? '';
        $gender =  $applicant['student_information']['gender'] ?? '';
        $dob = $applicant['student_information']['date_of_birth'] ?? '';
        $address = $applicant['student_information']['address'] ?? '';
        $matricBoardName = $applicant['matric_board'] ?? '';
        $intermediateBoardName = $applicant['intermediate_board'] ?? '';
        $mdcatYear = $applicant['test_score_year'] ?? '';
        $mdcatRollNo = $applicant['test_score_roll_no'] ?? '';
        $meritStanding = $applicant['date'] ?? '';


        // Add the data to the array
        $data[] = [
            $voucherId,
            $fullName,
            $fatherName,
            $cnic,
            $gender,
            $dob,
            $address,
            $phoneNumber,
            $email,
            $matricBoardName,
            $matricTotal,
            $matricObtained,
            $matricPercentage * 0.1,
            $intermediateBoardName,
            $intermediateTotal,
            $intermediateObtained,
            $intermediatePercentage * 0.4,
            $mdcatYear,
            $mdcatRollNo,
            $testScoreTotal,
            $testScoreObtained,
            $testScorePercentage * 0.5,
            $date,
            $aggregate,
        ];
    }

    // Sort the data by the aggregate (descending order)
    usort($data, function ($a, $b) {
        return $b[23] <=> $a[23];
    });
    foreach ($data as &$applicant) {
        $applicant[] = $meritPosition; // Assign merit position counter
        $meritPosition++; // Increment merit position for the next applicant
    }
    unset($applicant); // unset reference to last element
    


    // Set the data rows
    $worksheet->fromArray($data, null, 'A2');

    // Create a temporary file to save the spreadsheet
    $tempFilePath = tempnam(sys_get_temp_dir(), 'applicants_');
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($tempFilePath);

    // Return the Excel file as a response
    return response()->download($tempFilePath, 'applicants_Merit_List.xlsx')->deleteFileAfterSend(true);
}




public function appRejectedExcel(Request $request, $program_id)
{
    $response = $this->ApplicantsApplicationRejected($request, $program_id);
    $applicantsData = json_decode($response->getContent(), true);

    //log::debug($applicantsData);

    // Create a new spreadsheet
    $spreadsheet = new Spreadsheet();

    // Create a new worksheet
    $worksheet = $spreadsheet->getActiveSheet();

    // Define the column headers
    $headers = [
        'Full Name',
        'Father Name',
        'Phone Number',
        'Student ID',
        'Intermediate Percentage',
        'Test Score Percentage',
        'CNIC',
        'Email',
        'Voucher Id',
        'Date',
        'Reject Remarks'
        // Add more headers as needed
    ];

    // Set the column headers
    $worksheet->fromArray([$headers], null, 'A1');

    // Extract and format the data from $applicantsData
    $data = [];
    foreach ($applicantsData['applicantsData'] as $applicant) {
        $data[] = [
            ($applicant['student_information']['first_name'] ?? '') . " " . ($applicant['student_information']['last_name'] ?? ''),
            $applicant['student_information']['father_name'] ?? '',
            $applicant['student_information']['phone_number'] ?? '',
            $applicant['student_information']['student_id'] ?? '',
            $applicant['intermediate_percentage']['percentage_criteria'] ?? '',
            $applicant['test_score_percentage']['percentage'] ?? '',
            $applicant['cnic']['cnic'] ?? '',
            $applicant['cnic']['email'] ?? '',
            $applicant['voucherId'] ?? '',
            $applicant['date'] ?? '',
            $applicant['remarks'] ?? '',
            // Add more data fields as needed
        ];
    }

    // Set the data rows
    $worksheet->fromArray($data, null, 'A2');

    // Create a temporary file to save the spreadsheet
    $tempFilePath = tempnam(sys_get_temp_dir(), 'applicants_');
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($tempFilePath);

    // Return the Excel file as a response
    return response()->download($tempFilePath, 'applicants_Fee_Recieved.xlsx')->deleteFileAfterSend(true);
}



public function feeRejectedExcel(Request $request, $program_id)
{
    $response = $this->ApplicantsfeeApplicationRejected($request, $program_id);
    $applicantsData = json_decode($response->getContent(), true);

    //log::debug($applicantsData);

    // Create a new spreadsheet
    $spreadsheet = new Spreadsheet();

    // Create a new worksheet
    $worksheet = $spreadsheet->getActiveSheet();

    // Define the column headers
    $headers = [
        'Full Name',
        'Father Name',
        'Phone Number',
        'Student ID',
        'Intermediate Percentage',
        'Test Score Percentage',
        'CNIC',
        'Email',
        'Voucher Id',
        'Date',
        'Reject Remarks'
        // Add more headers as needed
    ];

    // Set the column headers
    $worksheet->fromArray([$headers], null, 'A1');

    // Extract and format the data from $applicantsData
    $data = [];
    foreach ($applicantsData['applicantsData'] as $applicant) {
        $data[] = [
            ($applicant['student_information']['first_name'] ?? '') . " " . ($applicant['student_information']['last_name'] ?? ''),
            $applicant['student_information']['father_name'] ?? '',
            $applicant['student_information']['phone_number'] ?? '',
            $applicant['student_information']['student_id'] ?? '',
            $applicant['intermediate_percentage']['percentage_criteria'] ?? '',
            $applicant['test_score_percentage']['percentage'] ?? '',
            $applicant['cnic']['cnic'] ?? '',
            $applicant['cnic']['email'] ?? '',
            $applicant['voucherId'] ?? '',
            $applicant['date'] ?? '',
            $applicant['remarks'] ?? '',
            // Add more data fields as needed
        ];
    }

    // Set the data rows
    $worksheet->fromArray($data, null, 'A2');

    // Create a temporary file to save the spreadsheet
    $tempFilePath = tempnam(sys_get_temp_dir(), 'applicants_');
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($tempFilePath);

    // Return the Excel file as a response
    return response()->download($tempFilePath, 'applicants_Fee_Recieved.xlsx')->deleteFileAfterSend(true);
}




public function verifyApplication(Request $request)
{
    $studentId = $request->input('studentId');
    $programId = $request->input('programId');
    $voucherId = $this->getVoucherId($studentId,$programId);
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

    $VerificatonWithMessage = 'Dear Applicant,' . "\n\n" . 'Your Application No' . " " .$voucherId . " " .'  for program' . " " . $programName . " " . "fee has been Received. You will a receive a confirmation E-mail once your application is verified. In case of any deficiency and/or incorrect Details Your Application will be rejected". "\n\n" ."Regards," . "\n\n" . "Admission Office" ;
    Mail::raw(($VerificatonWithMessage), function ($message) use ($email) {
        $message->to($email);
        $message->subject('STMU-Admission Update');
    });

    return response()->json(['message' => 'Voucher verified successfully'], 200);
}




public function acceptApplication(Request $request)
{
    $studentId = $request->input('studentId');
    $programId = $request->input('programId');
    $voucherId = $this->getVoucherId($studentId,$programId);

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
        return response()->json(['error' => 'Application not found'], 404);
    }

    // Update the voucher status to "verified"
    $voucher->application_status = 'Verified';
    $voucher->save();

    $VerificatonWithMessage = 'Dear Applicant,' . "\n\n" . 'Your Application No' . " " .$voucherId . " " .'  for program' . " " . $programName . " " . "has been verified Successfully by the Admission Office". "\n\n" ."Regards," . "\n\n" . "Admission Office" ;
    Mail::raw(($VerificatonWithMessage), function ($message) use ($email) {
        $message->to($email);
        $message->subject('STMU-Admission Update');
    });

    return response()->json(['message' => 'Application verified successfully'], 200);
}




public function rejectApplication(Request $request)
{
    $studentId = $request->input('studentId');
    $programId = $request->input('programId');
    $rejectRemarks = $request->input('rejectRemarks');
    $voucherId = $this->getVoucherId($studentId,$programId);

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

    $VerificatonWithMessage = 'Dear Applicant,' . "\n\n" . 'Your Application No' . " " .$voucherId . " " .'  for program' . " " . $programName . " " . "fee has been Rejected. due to ". $rejectRemarks . "\n". "You are advised to login to admission portal and complete/correct the information and resubmit the application". "\n\n" ."Regards," . "\n\n" . "Admission Office" ;
    Mail::raw(($VerificatonWithMessage), function ($message) use ($email) {
        $message->to($email);
        $message->subject('STMU-Admission Update');
    });

    return response()->json(['message' => 'Voucher Rejected successfully'], 200);
}


public function rejecttApplication(Request $request)
{
    $studentId = $request->input('studentId');
    $programId = $request->input('programId');
    $rejectRemarks = $request->input('rejectRemarks');
    $voucherId = $this->getVoucherId($studentId,$programId);
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
    $voucher->application_status = 'Rejected';
    $voucher->remarks = $rejectRemarks;
    $voucher->save();

    $VerificatonWithMessage = 'Dear Applicant,' . "\n\n" . 'Your Application No' . " " .$voucherId . " " .'  for program' . " " . $programName . " " . "has been Rejected due to "." ".$rejectRemarks." "."by the Admission Office". "\n\n" ."Regards," . "\n\n" . "Admission Office" ;
    Mail::raw(($VerificatonWithMessage), function ($message) use ($email) {
        $message->to($email);
        $message->subject('STMU-Admission Update');
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
public function getPdfStudent($filename)
{
    $filePath = public_path("studentsImages/{$filename}");

    if (file_exists($filePath)) {
        return response()->file($filePath);
    }

    return response()->json(['error' => 'File not found'], 404);
}

public function getPdfStudentCnic($filename)
{
    $filePath = public_path("studentsImagesCnic/{$filename}");

    if (file_exists($filePath)) {
        return response()->file($filePath);
    }

    return response()->json(['error' => 'File not found'], 404);
}
public function getPdfStudentDegree($filename)
{
    $filePath = public_path("degrees/{$filename}");

    if (file_exists($filePath)) {
        return response()->file($filePath);
    }

    return response()->json(['error' => 'File not found'], 404);
}
public function getPdfStudentTest($filename)
{
    $filePath = public_path("attachment_directory/{$filename}");

    if (file_exists($filePath)) {
        return response()->file($filePath);
    }

    return response()->json(['error' => 'File not found'], 404);
}


public function updateEducationData(Request $request)
{
    // Validate the request data
    $validatedData = $request->validate([
        'studentId' => 'required|integer',
        'degreeId' => 'required|integer',
        'totalMarks' => 'required|integer',
        'obtainedMarks' => 'required|integer',
        'passingYear' => 'required|integer',
    ]);

    $degreeId = $validatedData['degreeId'];
    $studentId = $validatedData['studentId'];

    // Find the education record by degree ID
    $education = Education::where('degree_id', $degreeId)
        ->where('student_id', $studentId)
        ->first();

    if (!$education) {
        return response()->json(['message' => 'Education record not found'], 404);
    }

    // Calculate the percentage
    $totalMarks = $validatedData['totalMarks'];
    $obtainedMarks = $validatedData['obtainedMarks'];
    $percentage = number_format(($obtainedMarks / $totalMarks) * 100, 2);

    // Fetch student data
    $student = Student::where('student_id', $studentId)->first();

    // Update the education record with the new data
    $education->total_marks = $totalMarks;
    $education->obtained_marks = $obtainedMarks;
    $education->passing_year = $validatedData['passingYear'];
    $education->percentage_criteria = $percentage;
    $education->save();

    // Prepare the message content
    $messageContent = "Student ID: $studentId\nFirst Name: {$student->first_name}\nLast Name: {$student->last_name}\n";
    $messageContent .= "Existing Total Marks: {$education->total_marks}\nExisting Obtained Marks: {$education->obtained_marks}\nExisting Passing Year: {$education->passing_year}\nExisting Percentage: {$education->percentage_criteria}\n";
    $messageContent .= "Modified Total Marks: $totalMarks\nModified Obtained Marks: $obtainedMarks\nModified Passing Year: {$validatedData['passingYear']}\nModified Percentage: $percentage\n";
    $messageContent .= "By Admin {$request->userEmail}";
    // Send the email using Mail::raw
    Mail::raw($messageContent, function ($message) use ($studentId, $student, $education, $totalMarks, $obtainedMarks, $percentage) {
        $message->to('khubaib.mis@stmu.edu.pk');
        $message->subject('Education Data Updated');
    });

    return response()->json(['message' => 'Education data updated successfully']);
}



    public function updateTestData(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'studentId' => 'required|integer',
            'testScoreId' => 'required|integer',
            'totalMarks' => 'required|integer',
            'obtainedMarks' => 'required|integer',
        ]);
    
        $studentId = $validatedData['studentId'];
        $testScoreId = $validatedData['testScoreId'];
    
        // Find the education record by degree ID
        $education = TestScore::where('test_score_id', $testScoreId)
            ->where('student_id', $studentId)
            ->first();
    
        if (!$education) {
            return response()->json(['message' => 'Test record not found'], 404);
        }
    
        // Calculate the percentage
        $totalMarks = $validatedData['totalMarks'];
        $obtainedMarks = $validatedData['obtainedMarks'];
        $percentage = number_format(($obtainedMarks / $totalMarks) * 100, 2);
    
        // Fetch student data
        $student = Student::where('student_id', $studentId)->first();
    
        // Store existing test scores
        $existingTotalMarks = $education->test_score_total;
        $existingObtainedMarks = $education->test_score;
        $existingPercentage = $education->percentage;
    
        // Update the education record with the new data
        $education->test_score_total = $totalMarks;
        $education->test_score = $obtainedMarks;
        $education->percentage = $percentage;
        $education->save();
    
        // Prepare the message content
        $messageContent = "Student ID: $studentId\nFirst Name: {$student->first_name}\nLast Name: {$student->last_name}\n";
        $messageContent .= "Existing Total Marks: $existingTotalMarks\nExisting Obtained Marks: $existingObtainedMarks\nExisting Percentage: $existingPercentage\n";
        $messageContent .= "Modified Total Marks: $totalMarks\nModified Obtained Marks: $obtainedMarks\nModified Percentage: $percentage\n";
        $messageContent .= "By Admin {$request->userEmail}";

    
        // Send the email using Mail::raw
        Mail::raw($messageContent, function ($message) use ($studentId, $student, $existingTotalMarks, $existingObtainedMarks, $existingPercentage, $totalMarks, $obtainedMarks, $percentage) {
            $message->to('khubaib.mis@stmu.edu.pk');
            $message->subject('Test Scores Updated');
        });
    
        return response()->json(['message' => 'Test data updated successfully']);
    }
    


}
