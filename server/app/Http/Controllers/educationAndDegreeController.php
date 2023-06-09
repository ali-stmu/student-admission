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
        log::debug($records = $request->input('records'));

        // Process each record
        foreach ($records as $record) {
            //$resultStatus = $record['resultStatus'];
            //$qualification = $record['qualification'];
            //$boardUniversity = $record['boardUniversity'];
            //$passingYear = $record['passingYear'];
            //$totalMarksCGPA = $record['totalMarksCGPA'];
            //$obtainedMarksCGPA = $record['obtainedMarksCGPA'];
            //$percentage = $record['percentage'];
            //log::debug($degree = $record['degree']);

            if (isset($record['degree']) && $record['degree'] instanceof \Illuminate\Http\UploadedFile) {
                log::debug("hello from inside if");
                $degreeFile = $record['degree'];
                $degreeFileName = $degreeFile->getClientOriginalName();
                log::debug($degreeFile->storeAs('degrees', $degreeFileName, 'public'));
                // $educationModel->degree = $degreeFileName;
            }
        }

        // Return a response
        return response()->json(['message' => 'Data received successfully']);
    }
}
