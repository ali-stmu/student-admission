<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Voucher;
use App\Models\student;
use App\Models\Program;

use Illuminate\Support\Facades\Log;



class VoucherController extends Controller
{
    public function index(Request $request)
{
    // Retrieve data from the request
    $data = $request->all();
    $user_id = $data['user_id'];

    // Find the student based on the user_id
    $student = Student::where('user_id', $user_id)->first();

    if ($student) {
        // If a student with the given user_id is found, get their student_id
        $studentId = $student->student_id;

        // Query the Voucher table to get all vouchers for the student
        $vouchers = Voucher::where('student_id', $studentId)->get();

        if ($vouchers->isEmpty()) {
            // Handle the case where no vouchers are found for the student
            Log::debug('No vouchers found for the student.');
        } else {
            // Initialize an array to store program details
            $programDetails = [];

            // Loop through each voucher and retrieve program details
            foreach ($vouchers as $voucher) {
                $programId = $voucher->program_id;
                $status = $voucher->status;
                $application_status = $voucher->application_status;


                // Query the Program model to get program details by program_id
                $program = Program::where('Program_id', $programId)->first();

                if ($program) {
                    // Add program details to the array
                    $programDetails[] = [
                        'program_id' => $programId,
                        'program_name' => $program->program_name, // Assuming 'program_name' is the field you want
                        'status' => $status,
                        'application_status' => $application_status,

                    ]; // Assuming 'program_name' is the field you want
                }
            }

            // Now, $programDetails contains program names for each program_id associated with the student's vouchers
            $response = [
                'program_names' => $programDetails
            ];

            return response()->json($response);
        }
    } else {
        // Handle the case where no student is found for the given user_id
        Log::debug('No student found for the user_id.');
    }
}

    

    
    
}
