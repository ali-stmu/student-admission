<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Models\student;
use App\Models\education;
use App\Models\Degree;
use App\Models\State;
use App\Models\Program;
use App\Models\User;
use App\Models\TestScore;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use App\Models\Country; // Import the Country model at the top of your controller
use App\Models\Voucher;




class StudentInfoController extends Controller
{
    //
    public function getStatesByCountryCode(Request $request)
    {
        $countryCode = $request->query('country_code');
        log::debug($countryCode);
        
        // Assuming you have a 'states' table with a 'country_code' column
        $states = State::where('country_code', $countryCode)->get();
        log::debug($states);
        
        return response()->json($states);
    }
public function getAllCountries()
{
    $countries = Country::all();

    return response()->json(['countries' => $countries]);
}

public function getPriority(Request $request)
{
    try {
        $totalMarks = 0;
        $obtainedMarks = 0;
        $testScores = 0;
        $testName = "";

        $student = new Student;
        $studentId = Student::where('user_id', $request->user_id)->value('student_id');

        // Get the nationality of the user
        $nationality = User::where('user_id', $request->user_id)->value('nationality');
        Log::debug($nationality);

        $studentInfoToCalculatePercentage = Education::select('total_marks', 'degree_id', 'result_status', 'obtained_marks')
            ->where('student_id', $studentId)
            ->get();
        //Log::debug("StudentInfo to calculate percentage:".$studentInfoToCalculatePercentage);

        $intermediateDegrees = Degree::where('degree_name', 'Intermediate/A-Levels/Equivalent')->pluck('degree_name', 'degree_id');
        $TestInformation = TestScore::where('student_id', $studentId)->first();
        log::debug($TestInformation);
        if ($TestInformation) {
            $testScores = $TestInformation->percentage;
            $testName = $TestInformation->test_name; 

        } else {
          
        }


        $programs = [];

        foreach ($studentInfoToCalculatePercentage as $education) {
            $degreeId = $education->degree_id;
            $resultStatus = $education->result_status;
            $status = $education->status;
            $degree_id = $education->degree_id;


            //log::debug("Degree Id".$degreeId);
            //log::debug($intermediateDegrees);
            //This condition checking if result sttaus is declared and its general status is 1 means active and degree id is 2 which means of intermediate
            if ($intermediateDegrees->has($degreeId) && $resultStatus == "declared" && $status = '1' && $degree_id == '2' ) {
                foreach ($studentInfoToCalculatePercentage as $edu) {
                    if ($edu->degree_id === $degreeId) {
                        $totalMarks += $edu->total_marks;
                        $obtainedMarks += $edu->obtained_marks;
                        log::debug("Total marks is".$totalMarks);
                        log::debug("Obtined marks is".$obtainedMarks);
                    }
                }
            // Get the student's voucher IDs for programs they've already applied to                
             $voucherProgramIds = Voucher::where('student_id', $studentId)
                 ->pluck('program_id')
                 ->toArray();
                //log::debug($voucherProgramIds);
                $percentage = ($obtainedMarks / $totalMarks) * 100;
                //log::debug($percentage);

                $query = Program::select('program_name', 'program_criteria','test_criteria')
                    ->where('degree_id', $degreeId)->where('status', '1');
                    // Modify the query to exclude programs where student and program IDs match in vouchers
                 $programs = $query
                 ->whereNotIn('program_id', $voucherProgramIds)
                 ->get();
                 if($testName !== 'mdcat'){
                    $nationality === 'foreign';
                    $query->whereIn('nationality_check', ['foreign']);
                 }
                 
                if ($nationality === 'pakistani') {
                    $query->whereIn('nationality_check', ['pakistani']);
                } else if ($nationality === 'foreign') {
                    $query->whereIn('nationality_check', ['foreign']);
                }else if ($nationality === 'dual'){
                    $query->whereIn('nationality_check', ['foreign','dual','pakistani']);
                }

                if (is_null($testScores) ||$testScores == [0]) {
                    $query->where('test_criteria', 0);
                } else {
                    $query->where('test_criteria', '<=', $testScores);
                }

                $programs = $query->where('program_criteria', '<=', $percentage)
                    ->get();
            }
        }

        if (empty($programs)) {
            return response()->json(['error' => 'No programs found'], 404);
        }

        return response()->json(['Programs' => $programs]);
    } catch (\Exception $e) {
        // Handle any exceptions that may occur
        return response()->json(['error' => $e->getMessage()], 500);
    }
}





    public function updateRecord(Request $request, $id)
    {
        // Find the record by ID
        //  log::debug($id);
        $record = student::where('user_id', $id)->first();
        //log::debug(  $request->input('first_name'));

        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $record->first_name = $request->input('first_name');
        $record->middle_name = $request->input('middle_name');
        $record->last_name = $request->input('last_name');
        $record->phone_number = $request->input('phone_number');
        $record->father_contact = $request->input('father_contact');
        $record->cnic = $request->input('cnic');
        $record->gender = $request->input('gender');
        $record->date_of_birth = $request->input('date_of_birth');
        $record->religion = $request->input('religion');
        $record->father_name = $request->input('father_name');
        $record->father_email = $request->input('father_email');
        $record->mother_name = $request->input('mother_name');
        $record->father_occupation = $request->input('father_occupation');
        $record->land_line = $request->input('land_line');
        $record->user_id = $request->input('user_id');

        $record->save();


        // Handle the uploaded image
        if ($request->hasFile('temp_image')) {
            $image = $request->file('temp_image');

            // Generate a unique filename for the image
            $imageName = time() . '.' . $image->getClientOriginalExtension();

            // Specify the storage path for the image
            $storagePath = public_path('studentsImages');

            // Move the uploaded file to the specified storage path
            $image->move($storagePath, $imageName);

            // Get the full path of the saved image
            $fullImagePath = $storagePath . '/' . $imageName;
            // Get the relative path by subtracting the base path
            $relativeImagePath = str_replace(public_path(), '', $fullImagePath);
            // Log the full path of the saved image
            // Log::debug('Full path of the saved image: '.$fullImagePath);
            log::debug($relativeImagePath);
            $record->image = $relativeImagePath;
        }
        if ($request->hasFile('temp_image_cnic')) {
            $image = $request->file('temp_image_cnic');

            // Generate a unique filename for the image
            $imageName = time() . '.' . $image->getClientOriginalExtension();

            // Specify the storage path for the image
            $storagePath = public_path('studentsImagesCnic');

            // Move the uploaded file to the specified storage path
            $image->move($storagePath, $imageName);

            // Get the full path of the saved image
            $fullImagePath = $storagePath . '/' . $imageName;
            // Get the relative path by subtracting the base path
            $relativeImagePath = str_replace(public_path(), '', $fullImagePath);
            // Log the full path of the saved image
            // Log::debug('Full path of the saved image: '.$fullImagePath);
            log::debug($relativeImagePath);
            $record->cnic_image = $relativeImagePath;
        }
        $record->save();

        // Return a response if needed
        // return response()->json(['message' => 'Record updated successfully']);
    }



    public function searchUser($user_id)

    {

        $student = new student;
        $student = student::where('user_id', $user_id)->first();
        if ($student) {
            // Student record found
            //  $this->sendData('user_id');
            return "Found";
        } else {
            // Student record not found
            return "Not Found";
        }
    }



    public function searchUserData($user_id)

    {
        $student = new student;
        $student = student::where('user_id', $user_id)->first();
        return response()->json($student);
    }



    public function storeStudentData(Request $request)
    {
        if ($request->input('useEffectChecked') != 1) {
            //  log::debug($this->searchUser($request->input('user_id')));
            if ($this->searchUser($request->input('user_id')) == 'Not Found') { //to insert new record
                //log::debug($data = $request->all());
                $student = new student;
                $student->first_name = $request->input('first_name');
                $student->middle_name = $request->input('middle_name');
                $student->last_name = $request->input('last_name');
                $student->phone_number = $request->input('phone_number');
                $student->father_contact = $request->input('father_contact');
                $student->cnic = $request->input('cnic');
                $student->gender = $request->input('gender');
                $student->date_of_birth = $request->input('date_of_birth');
                $student->religion = $request->input('religion');
                $student->father_name = $request->input('father_name');
                $student->father_email = $request->input('father_email');
                $student->mother_name = $request->input('mother_name');
                $student->father_occupation = $request->input('father_occupation');
                $student->land_line = $request->input('land_line');
                $student->user_id = $request->input('user_id');
                $student->save();
                if ($request->hasFile('temp_image')) {
                    $image = $request->file('temp_image');
                    $imageName = time() . '.' . $image->getClientOriginalExtension();
                    $storagePath = public_path('studentsImages');
                    $image->move($storagePath, $imageName);
                    $fullImagePath = $storagePath . '/' . $imageName;
                    $relativeImagePath = str_replace(public_path(), '', $fullImagePath);
                    // Log the full path of the saved image
                    Log::debug('Full path of the saved image: '.$fullImagePath);
                    // log::debug($relativeImagePath);
                    $student->image = $relativeImagePath;
                }
                if ($request->hasFile('temp_image_cnic')) {
                    $image = $request->file('temp_image_cnic');
                    log::debug($image);
                    $imageName = time() . '.' . $image->getClientOriginalExtension();
                    $storagePath = public_path('studentsImagesCnic');
                    $image->move($storagePath, $imageName);
                    $fullImagePath = $storagePath . '/' . $imageName;
                    $relativeImagePath = str_replace(public_path(), '', $fullImagePath);
                    // Log the full path of the saved image
                    //log::debug('Full path of the saved image: '.$fullImagePath);
                    log::debug($relativeImagePath);
                    $student->cnic_image = $relativeImagePath;
                }
                $student->save();

                // Return a response if needed
                return response()->json(['message' => 'Data received successfully']);
            }


            if ($this->searchUser($request->input('user_id')) == 'Found' && $request->input('userEffectChecked') == 1) {
                //log::debug($this->searchUser($request->input('user_id')));
                return response()->json($this->searchUserData($request->input('user_id')));  //to retrive and send exiting record
            }
        }

        if ($this->searchUser($request->input('user_id')) && $request->input('userEffectChecked') != 1) {    //to update

            ($this->updateRecord($request, $request->input('user_id')));
            //log::debug($request->input('user_id'));

        }
    }

    public function storeStudentDataAddress(Request $request)
    {
        $data = $request->all();
        $record = student::where('user_id', $request->input('user_id'))->first();     //update and save new record

        $record->address = $request->input('address');
        $record->country = $request->input('country');
        $record->zip_code = $request->input('zipcode');
        $record->city = $request->input('city');
        $record->state = $request->input('state');
        $record->t_address = $request->input('taddress');
        $record->t_zip_code = $request->input('tzipcode');
        $record->t_city = $request->input('tcity');
        $record->t_state = $request->input('tstate');
        $record->t_country = $request->input('tcountry');
        $record->save();
        return response()->json(['message' => 'Done o']);
    }

    public function useEffectStoreStudentDataAddress(Request $request)
    {

        $data = $request->all();
        $record = student::where('user_id', $request->input('user_id'))->first();
        //log::debug($request->input('user_id'));
        //log::debug("call use effect");
        return response()->json(['StudentInfo' => $record]);
    }
}
