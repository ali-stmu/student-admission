<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Models\student;
use App\Models\Education;
use App\Models\Degree;
use App\Models\program;
use App\Models\user;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;



class StudentInfoController extends Controller
{
    //

    public function getPriority(Request $request)
    {
        $totalMarks = 0;
        $obtainedMarks = 0;

        //log::debug("Called");

        $student = new student;
        $studentId = student::where('user_id', $request->user_id)->value('student_id');

        $studentInfoToCalcuatePercentage = Education::select('total_marks', 'degree_id', 'result_status', 'obtained_marks')
            ->where('student_id', $studentId)
            ->get();;

        log::debug($studentInfoToCalcuatePercentage);

        $intermediateDegrees = Degree::where('degree_description', 'Intermediate')->pluck('degree_name', 'degree_id');

        foreach ($studentInfoToCalcuatePercentage as $education) {
            $degreeId = $education->degree_id;
            $result_status = $education->result_status;

            if ($intermediateDegrees->has($degreeId) && $result_status == "declared") {
                $degreeName = $intermediateDegrees->get($degreeId);
                foreach ($studentInfoToCalcuatePercentage as $education) {
                    if ($education['degree_id'] === $degreeId) {

                        $totalMarks += $education['total_marks'];
                        $obtainedMarks += $education['obtained_marks'];
                        $percentage = ($obtainedMarks / $totalMarks) * 100;
                        log::debug($percentage);

                        $programs = program::select('program_name', 'program_criteria')
                            ->where('degree_id', $degreeId)
                            ->get();
                        log::debug($programs);
                        return response()->json(['Programs' => $programs]);
                    }
                }
                //log::debug($degreeName);

                // Now you can use $degreeName along with other education data for further calculations
            } else {
                // Handle the case where a matching intermediate degree is not found
            }
        }


        if ($studentId) {
            // return response()->json(['StudentInfo' => $studentId]);
        } else {
            // Student record not found
            return "Not Found";
            return response()->json(['Awaked' => "Not Found"]);
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
                    // Log::debug('Full path of the saved image: '.$fullImagePath);
                    // log::debug($relativeImagePath);
                    $student->image = $relativeImagePath;
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
        log::debug("call use effect");
        return response()->json(['StudentInfo' => $record]);
    }
}
