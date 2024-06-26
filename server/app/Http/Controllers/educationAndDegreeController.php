<?php

namespace App\Http\Controllers;

use App\Models\education;
use App\Models\document;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException; // Import QueryException if not already imported
use App\Models\student;
use App\Models\TestScore;

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
            ->where('education.status', '=', '1')
            ->where('document.student_id', '=', $studentId)
            ->get());
    }
    public function findTestInfo($studentId)
    {
        return (DB::table('test_score')
            ->select(
                'student_id',
                'test_score',
                'test_date',
                'test_score_total',
                'attachment_url',

            )
            ->where('student_id', '=', $studentId)
            ->get());
    }


   public function createTestScore(Request $request)
{
    $data = $request->all();
    Log::debug($data);

    $user_id = $data['user_id'];
    Log::debug("User Id is " . $user_id);

    $student_id_json = $this->findStudentId($user_id);
    $studentId = $student_id_json->getData()->student_id;
    Log::debug("Student Id is " . $studentId);

    foreach ($data['records'] as $record) {
        $test_name = $record['test_name'];
        $test_date = $record['test_date'];
        $test_city = $record['test_city'];
        $test_reg_no = $record['test_reg_no'];
        $test_type = $record['test_type'];
        $attachment_url = null;
        $existingSkippedTest = TestScore::where('student_id', $studentId)
        ->where('skip_test', 1)
        ->first();

    // If such a record exists, delete it
        if ($existingSkippedTest) {
            $existingSkippedTest->delete();
        }
        $existingTestInfo = TestScore::where('student_id', $studentId)
        ->where('test_type', $test_type)
        ->where('test_name', $test_name)
        ->first();

        if (isset($record['attachment'])) {
            // Get the uploaded file from the request
            $attachmentFile = $record['attachment'];

            // Generate a unique filename for the attachment
            $attachmentFileName = uniqid() . '_' . $attachmentFile->getClientOriginalName();

            // Move the uploaded file to the attachment directory
            $attachmentFile->move('attachment_directory', $attachmentFileName);

            // Construct the attachment URL
            $attachment_url = '/attachment_directory/' . $attachmentFileName;
            log::debug($attachment_url);
        }
        elseif ($existingTestInfo){
            $attachment_url = $existingTestInfo->attachment_url;
        }
        $bio_total = $record['test_score_bio'] ?? null;
        $chem_total = $record['test_score_chem'] ?? null;
        $phy_total = $record['test_score_phy_total'] ?? null;
        $bio_obtained = $record['test_score_bio_obtained'] ?? null;
        $chem_obtained = $record['test_score_chem_obtained'] ?? null;
        $phy_obtained = $record['test_score_phy_obtained'] ?? null;

        // Check if test scores are provided in the record
        if (isset($record['test_score_total']) && isset($record['test_score_obtained'])) {
            $test_score_total = $record['test_score_total'];
            $test_score_obtained = $record['test_score_obtained'];
            
            // Calculate percentage if total is not null
            $percentage = ($test_score_obtained / $test_score_total) * 100;
        } else {
            $test_score_total = null;
            $test_score_obtained = null;
            $percentage = null;
        }

        // Check if a record with the same test_name and test_date exists
      

        if ($existingTestInfo) {
            // Update existing test record
            $existingTestInfo->update([
                'test_name' =>  $test_name,
                'test_score_total' => $test_score_total,
                'test_score' => $test_score_obtained,
                'attachment_url' => $attachment_url,
                'percentage' => $percentage,
                'test_reg_no' => $test_reg_no,
                'test_city' => $test_city,
                'bio_total' => $bio_total,
                'chem_total' => $chem_total,
                'phy_total' => $phy_total,
                'bio_obtained' => $bio_obtained,
                'chem_obtained' => $chem_obtained,
                'phy_obtained' => $phy_obtained,
                'test_type' => $test_type,
                // Add other fields as needed
            ]);
        } else {
            // Insert a new test record
            $testScore = new TestScore([
                'student_id' => $studentId,
                'test_name' => $test_name,
                'test_date' => $test_date,
                'test_score_total' => $test_score_total,
                'test_score' => $test_score_obtained,
                'attachment_url' => $attachment_url,
                'test_reg_no' => $test_reg_no,
                'test_city' => $test_city,
                'percentage' => $percentage,
                'skip_test' => 0,
                'bio_total' => $bio_total,
                'chem_total' => $chem_total,
                'phy_total' => $phy_total,
                'bio_obtained' => $bio_obtained,
                'chem_obtained' => $chem_obtained,
                'phy_obtained' => $phy_obtained,
                'test_type' => $test_type,
                // Add other fields as needed
            ]);

            // Save the record to the database
            $testScore->save();
        }
    }

    // You can add any additional logic or response here as needed
    return response()->json(['message' => 'Test scores saved/updated successfully']);
}


public function deleteTest($id, $studentId)
{
    try {
        // Attempt to delete the test based on the $id and $studentId parameters.
        // You can use Eloquent or query builder to perform the database operation.
        TestScore::where('test_score_id', $id)->where('student_id', $studentId)->delete();

        // Return a success response.
        return response()->json(['message' => 'Test deleted successfully'], 200);
    } catch (QueryException $e) {
        // Handle the database-related exception (e.g., constraint violations) and return an error response.
        return response()->json(['message' => 'Unable to delete the test. Database error: ' . $e->getMessage()], 500);
    } catch (\Exception $e) {
        // Handle other general exceptions and return an error response.
        return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
    }
}


public function skip_test(Request $request, $user_id)
{
    // Find the student ID based on the user ID
    $student_id_json = $this->findStudentId($user_id);
    $studentId = $student_id_json->getData()->student_id;

    // Check if a record exists for the student
    $existingTestInfo = TestScore::where('student_id', $studentId)->first();

    if ($existingTestInfo) {
        // Update the 'skip_test' column to 1 for the corresponding student ID
        $existingTestInfo->update(['skip_test' => 1]);
    } else {
        // Insert a new record for the student if it doesn't exist
        TestScore::create([
            'student_id' => $studentId,
            'skip_test' => 1,
        ]);
    }

    // Return a response
    return response()->json(['message' => 'Test score skipped or inserted successfully']);
}

public function testInformation(Request $request, $user_id)
{
    // Find the student ID based on the user ID
    $student_id_json = $this->findStudentId($user_id);
    $studentId = $student_id_json->getData()->student_id;

    // Check if a record exists for the student
    $existingTestInfo = TestScore::where('student_id', $studentId)->first(); // Use first() instead of get()

    if ($existingTestInfo) {
        // If a record exists, return its data
        return response()->json($existingTestInfo);
    } else {
        // If no record exists, return an empty array
        return response()->json([]);
    }
}

public function modifyEducationStatus(Request $request)
{
    log::debug($request->all());
    $user_id = $request->input('params.user_id');
    $qualification = $request->input('params.qualification');
    log::debug($user_id);
    
    // Find the student ID based on the user ID
    $student_id_json = $this->findStudentId($user_id);
    $studentId = $student_id_json->getData()->student_id;

    // Update the 'status' column to 0 where student ID and qualification match
    $updatedRows = Education::where('student_id', $studentId)
        ->where('degree_id', $qualification)
        ->update(['status' => 0]);

    if ($updatedRows > 0) {
        return response()->json(['message' => 'Education status updated successfully']);
    } else {
        return response()->json(['message' => 'No matching records found'], Response::HTTP_NOT_FOUND);
    }
}


    public function getScoresByUserId($user_id)
    {
        log::debug("44".$user_id);
        // Fetch test scores for the specified user_id
        $student_id_json = $this->findStudentId($user_id);
        $studentId = $student_id_json->getData()->student_id;
        $testScores = TestScore::where('student_id', $studentId)->where('skip_test', '!=', 1)->get();
        log::debug($testScores);
        // Return the data as a JSON response
        return response()->json($testScores);
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
            //$percentage = $request->input('percentage');
            //log::debug($percentage);
            log::debug($degreeFiles = $request->file('degree'));
            // Calculate percentage and fix decimal precision to 2
            $percentage = [];
            foreach ($totalMarksCGPA as $index => $total) {
                $obtained = $obtainedMarksCGPA[$index];
                $percentage[$index] = number_format(($obtained / $total) * 100, 2);
            }

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
                $education->status = 1;
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
