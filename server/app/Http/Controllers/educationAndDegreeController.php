<?php

namespace App\Http\Controllers;

use App\Models\Education;
use App\Models\Document;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Student;

class EducationAndDegreeController extends Controller
{


    public function findStudentId($user_id)
    {
        $student = Student::where('user_id', $user_id)->first();
        if ($student) {
            $student_id = $student->student_id;
            //Log::debug('Found student_id: ' . $student_id);
            return response()->json(['student_id' => $student_id]);
        } else {
            Log::debug('Student not found for user_id: ' . $user_id);
        }
    }
    public function storeDegreeAndDocument(Request $request)
    {
        //log::debug($request->input('user_id'));
        $student_id_json = $this->findStudentId($user_id = $request->input('user_id'));
        $studentId = $student_id_json->getData()->student_id;
        //  log::debug($studentId);
        // Process the incoming form data
        $resultStatus = $request->input('resultStatus');
        $qualification = $request->input('qualification');
        $boardUniversity = $request->input('boardUniversity');
        $passingYear = $request->input('passingYear');
        $totalMarksCGPA = $request->input('totalMarksCGPA');
        $obtainedMarksCGPA = $request->input('obtainedMarksCGPA');
        $percentage = $request->input('percentage');
        $degreeFiles = $request->file('degree');
        $user_id = $request->input('user_id');

        // Perform validation if needed

        // Save the data to the database or perform any desired operations
        // Example:
        foreach ($resultStatus as $index => $status) {
            // Assuming you have an "Education" model
            $education = new Education();
            $education->resultStatus = $status;
            $education->qualification = $qualification[$index];
            $education->boardUniversity = $boardUniversity[$index];
            $education->passingYear = $passingYear[$index];
            $education->totalMarksCGPA = $totalMarksCGPA[$index];
            $education->obtainedMarksCGPA = $obtainedMarksCGPA[$index];
            $education->percentage = $percentage[$index];
            // Save the education record
            // $education->save();

            // Store the degree file if available
            if ($degreeFiles[$index]) {
                log::debug($degreeFiles[$index]->store('degrees'));
            }
        }
    }
}
