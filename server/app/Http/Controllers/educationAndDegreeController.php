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
        $student_id_json = $this->findStudentId($user_id = $request->input('user_id'));
        $studentId = $student_id_json->getData()->student_id;

        //$user_id = $request->input('user_id');
        $records = $request->input('records');

        // Process each record
        foreach ($records as $record) {
            //$resultStatus = $record['resultStatus'];
            //$qualification = $record['qualification'];
            //$boardUniversity = $record['boardUniversity'];
            //$passingYear = $record['passingYear'];
            //$totalMarksCGPA = $record['totalMarksCGPA'];
            //$obtainedMarksCGPA = $record['obtainedMarksCGPA'];
            //$percentage = $record['percentage'];
            log::debug($degree = $record['degree']);

            // Handle the degree file if it's not empty
            if (!empty($degree)) {
                log::debug($degreePath = $degree->store('degrees')); // Assuming you have a 'degrees' directory in your storage
                // Save the degree path to the database or perform any other required operations
            }

            // Save other data to the database or perform any other required operations
        }

        // Return a response
        return response()->json(['message' => 'Data received successfully']);
    }
}
