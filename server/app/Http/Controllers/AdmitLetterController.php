<?php

namespace App\Http\Controllers;
use App\Models\student;
use App\Models\User;
use App\Models\Program;
use PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdmitLetterEmail;
use Illuminate\Support\Facades\Log;


class AdmitLetterController extends Controller
{
    public function sendAdmitLetter(Request $request)
    {
        $studentId = $request->input('studentId');
        $programId = $request->input('programId');
    
        // Fetch student and program details from the database
        $student = Student::find($studentId);
        $program = Program::find($programId);
    
        // Check if the student exists
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }
    
        // Fetch user ID associated with the student
        $userId = $student->user_id;
    
        // Fetch user email using user ID
        $user = User::find($userId);
    
        // Check if the associated user exists
        if (!$user) {
            return response()->json(['error' => 'Associated user not found for the student'], 404);
        }
    
        // Create an array containing data for student and program
        $data = [
            'student_first_name' => $student->first_name,
            'student_last_name' => $student->last_name,
            'program_name' => $program->program_name,
            'student_id' => $studentId,
            'father_name' => $student->father_name,
            'cnic' => $user->cnic,
            'student_img' => public_path($student->image),
        ];

        log::debug($data['student_first_name']);
        log::debug($data['student_last_name']);
        log::debug($data['program_name']);
        
        // Load the view with the necessary data
        $pdf = PDF::loadView('admit_card', compact('data'));



    
        // Save PDF to temporary location or generate the file in memory
        $pdfPath = storage_path('app/admit_letters/') . 'admit_letter_' . $studentId . '.pdf';
        $pdf->save($pdfPath);
    
        // Send email with PDF attachment
        Mail::to($user->email)->send(new AdmitLetterEmail($pdfPath));
        $student->admit_card_status = 1;
        $student->save();
    
        // Delete temporary PDF file if needed
        // unlink($pdfPath);
    
        return response()->json(['message' => 'Admit letter sent successfully']);
    }
    

}
