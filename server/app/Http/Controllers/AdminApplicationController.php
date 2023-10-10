<?php

namespace App\Http\Controllers;
use App\Models\Admin;
use App\Models\Voucher;
use App\Models\Application;
use App\Models\student;
use App\Models\education;
use App\Models\TestScore;
use App\Models\Program; // Import the Program model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class AdminApplicationController extends Controller
{
    public function feeApplicationReceived(Request $request, $user_id)
    {
        try {
            // Use Eloquent to retrieve the admin details based on the user_id.
            $admin = Admin::where('user_id', $user_id)->first();

            if ($admin) {
                // Retrieve all programs where admin.college_id matches program.college_id
                $programs = Program::where('college_id', $admin->college_id)->get();

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

    // Concatenate the voucher file name with the voucher path
    $voucherFullPath = $voucherPath . $voucher->voucher_file_name;

    $applicantsData[] = [
        'student_information' => $studentInformation,
        'intermediate_percentage' => $intermediatePercentage,
        'test_score_percentage' => $testScorePercentage,
        'voucher_full_path' => $voucherFullPath, // Include the full voucher path
        'file_name' => $voucher->voucher_file_name, // Include the full voucher path

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

public function getPdf($filename)
{
    $filePath = storage_path("app/voucher_files/{$filename}");

    if (file_exists($filePath)) {
        return response()->file($filePath);
    }

    return response()->json(['error' => 'File not found'], 404);
}




}
