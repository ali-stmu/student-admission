<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\student;
use App\Models\Program;
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
    $userId = $request->input('userID');
    $programFromClient = $request->input('program');

    $student_id_json = $this->findStudentId($userId);
    $studentId = $student_id_json->getData()->student_id;
    $first_name = $student_id_json->getData()->first_name;
    $last_name = $student_id_json->getData()->last_name;
    $Full_name =  $first_name ." ". $last_name;
    log::debug($Full_name);


    // Initialize an array to store program names
    $programNames = [];
    $collegeIds = [];

    // Retrieve the program names associated with program_id_1 to program_id_4
    $application = Application::where('student_id', $studentId)->first();

    if ($application) {
        $programIds = [
            $application->program_id_1,
            $application->program_id_2,
            $application->program_id_3,
            $application->program_id_4,
        ];

        foreach ($programIds as $programId) {
            if ($programId) {
                // Retrieve the program name based on program_id
                $program = Program::where('program_id', $programId)->first();
                if ($program) {
                    $programNames[] = $program->program_name;
                    $collegeIds[] = $program->college_id;
                }
            }
        }
    }
    log::debug($collegeIds);

    // Now you have the program names in the $programNames array

    $data = [
        'collegeName' => "Shifa Tameer-e-Millat University",
        'voucherID' => "123456",
        'date' => "2023-08-23",
        'dueDate' => "2023-09-01",
        'AccountTitle' => "SHIFA TAMEER-MILLAT UNIVERSITY",
        'bankAccountNumber' => "50007902906303",
        'programName' => $programFromClient, // Combine program names into a comma-separated string
        'studentName' => $Full_name,
        'rollNo' => "CS12345",
        'pyear' => "2023",
        'session' => "Fall",
        'totalAmount' => "5000",
        'bankLogoPath' => "https://drive.google.com/file/d/1WZqHnl8dICzdEGrIU4EL2DwXkGLnvNEW/view?usp=drive_link",
    ];

    $filePath = storage_path('bank_logo/2560px-Al_Baraka_logo.png');
    $pdf = PDF::loadView('challan', compact('data', 'filePath'));

    return $pdf->download('challan.pdf');
}

}
