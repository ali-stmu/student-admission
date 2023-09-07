<?php

namespace App\Http\Controllers;

use App\Models\education;
use App\Models\document;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\student;
use Illuminate\Http\Response;


class EducationAndDegreeController extends Controller
{


    public function findStudentId($user_id)
    {
        $student = student::where('user_id', $user_id)->first();
        if ($student) {
            $student_id = $student->student_id;
            //Log::debug('Found student_id: ' . $student_id);
            return response()->json(['student_id' => $student_id]);
        } else {
            Log::debug('Student not found for user_id: ' . $user_id);
        }
    }

    public function findEducationAndDocument($studentId)
    {
        return (DB::table('education')
            ->join('document', 'education.degree_id', '=', 'document.degree_id')
            ->select(
                'education.degree_id',
                'education.result_status',
                'education.institution_name',
                'education.obtained_marks',
                'education.passing_year',
                'education.total_marks',
                'education.school_name',
                'education.school_country',
                'education.school_city',
                'document.document_file_path',
            )
            ->where('education.student_id', '=', $studentId)
            ->where('document.student_id', '=', $studentId)
            ->get());
    }


    public function storeDegreeAndDocument(Request $request)
    {
        //log::debug($request->all());
        $student_id_json = $this->findStudentId($user_id = $request->input('user_id'));
        $studentId = $student_id_json->getData()->student_id;
        if ($request->input('useEffect') == 1) {
            $results = $this->findEducationAndDocument($studentId);
            $jsonData = json_encode($results);
            return response()->json($jsonData, Response::HTTP_OK);
        }

        if ($request->input('useEffect') != 1 && $this->findEducationAndDocument($studentId)->count() > 0) {    //update
            log::debug('Updated function called');

            //going to handle deleted rows using by zeroing the status.
            //  $compare_results = $this->findEducationAndDocument($studentId);
            $resultStatus = $request->input('resultStatus');
            $qualification = $request->input('qualification');
            $boardUniversity = $request->input('boardUniversity');
            $passingYear = $request->input('passingYear');
            $totalMarksCGPA = $request->input('totalMarksCGPA');
            $result_status = $request->input('resultStatus');
            $obtainedMarksCGPA = $request->input('obtainedMarksCGPA');
            $schoolName = $request->input('schoolName');
            $schoolCountry = $request->input('schoolCountry');
            $schoolCity = $request->input('schoolCity');
            $percentage = $request->input('percentage');
            log::debug($percentage);
            log::debug($degreeFiles = $request->file('degree'));

            $educationRecords = Education::where('student_id', $studentId)->get();
            $documentRecords = Document::where('student_id', $studentId)->get();
            foreach ($resultStatus as $index => $status) {
                $education = $educationRecords[$index] ?? new Education();
                $document = $documentRecords[$index] ?? new Document();
                // $education->resultStatus = $status;
                $education->degree_id = $qualification[$index];
                $education->institution_name = $boardUniversity[$index];
                $education->passing_year = $passingYear[$index];
                $education->total_marks = $totalMarksCGPA[$index];
                $education->result_status = $result_status[$index];
                $education->obtained_marks = $obtainedMarksCGPA[$index];
                $education->school_name = $schoolName[$index] ?? null;
                $education->school_country = $schoolCountry[$index] ?? null;
                $education->school_city = $schoolCity[$index] ?? null;
                $education->percentage_criteria = $percentage[$index];
                $education->student_id = $studentId;
                $document->student_id = $studentId;
                $document->degree_id = $qualification[$index];
                $document->degree_id;
                $education->save();
                if (isset($degreeFiles[$index])) {
                    $degreePath = $degreeFiles[$index]->store('degrees');
                    $document->document_file_path = $degreePath;
                    $document->save();
                }
            }
        }

        if ($request->input('useEffect') != 1 && $this->findEducationAndDocument($studentId)->count() == 0) {
            $resultStatus = $request->input('resultStatus');
            $qualification = $request->input('qualification');
            $boardUniversity = $request->input('boardUniversity');    //insert new record
            $passingYear = $request->input('passingYear');
            $totalMarksCGPA = $request->input('totalMarksCGPA');
            $result_status = $request->input('resultStatus');
            $schoolName = $request->input('schoolName');
            $schoolCountry = $request->input('schoolCountry');
            $schoolCity = $request->input('schoolCity');
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
                $education->result_status = $result_status[$index];
                $education->obtained_marks = $obtainedMarksCGPA[$index];
                $education->percentage_criteria = $percentage[$index];
                $education->school_name = $schoolName[$index];
                $education->school_country = $schoolCountry[$index];
                $education->school_city = $schoolCity[$index];
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
