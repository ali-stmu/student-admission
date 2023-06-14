<?php

namespace App\Http\Controllers;

use App\Models\education;
use App\Models\document;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Http\Response;


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
        log::debug($request->all());
        $student_id_json = $this->findStudentId($user_id = $request->input('user_id'));
        $studentId = $student_id_json->getData()->student_id;
        if ($request->input('useEffect') == 1) {
            $educationRecords = Education::where('student_id', $studentId)->get();
            $documentRecords = Document::where('student_id', $studentId)->get();
            // log::debug($educationRecords);
            //log::debug($documentRecords);

            $mergedRecords = array_merge($educationRecords->toArray(), $documentRecords->toArray());
            log::debug($jsonData = json_encode($mergedRecords));

            return response()->json($jsonData, Response::HTTP_OK);
        }
        if ($request->input('useEffect') != 1) {
            //log::debug($request->input('user_id'));

            //  log::debug($studentId);
            // Process the incoming form data
            // log::debug($allData = $request->all());
            $resultStatus = $request->input('resultStatus');
            $qualification = $request->input('qualification');
            $boardUniversity = $request->input('boardUniversity');
            $passingYear = $request->input('passingYear');
            $totalMarksCGPA = $request->input('totalMarksCGPA');
            $obtainedMarksCGPA = $request->input('obtainedMarksCGPA');
            log::debug($percentage = $request->input('percentage'));
            $degreeFiles = $request->file('degree');
            // $user_id = $request->input('user_id');
            foreach ($resultStatus as $index => $status) {
                // Assuming you have an "Education" model
                $education = new Education();
                $document = new Document();
                // $education->resultStatus = $status;
                log::debug($education->degree_id = $qualification[$index]);
                $education->institution_name = $boardUniversity[$index];
                $education->passing_year = $passingYear[$index];
                $education->total_marks = $totalMarksCGPA[$index];
                $education->obtained_marks = $obtainedMarksCGPA[$index];
                $education->percentage_criteria = $percentage[$index];
                $education->student_id = $studentId;
                $document->student_id = $studentId;
                $document->degree_id = $qualification[$index];
                // Save the education record
                // $education->save();

                // Store the degree file if available
                if ($degreeFiles[$index]) {
                    //log::debug($degreeFiles[$index]->store('degrees'));
                    $degreePath = $degreeFiles[$index]->store('degrees');
                    log::debug($document->document_file_path = $degreePath);
                    $education->save();
                    $document->save();
                }
            }
        }
    }
}
