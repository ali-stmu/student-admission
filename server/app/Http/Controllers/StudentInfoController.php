<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\student;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class StudentInfoController extends Controller
{
    //

    public function searchUser($user_id)

    {
        $student = new student;
        $student = student::where('user_id', $user_id)->first();

        // Do something with the $user record, such as returning a response
        return response()->json($student);
    }


    public function storeStudentData(Request $request)
    {
       if(!$this->searchUser($request->input('user_id'))){
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

        // Create a new entry in Table2 associated with Table1
        //$table2 = new Table2;
        //$table2->column3 = 'Value 3';
        //$table2->column4 = 'Value 4';
        //$table2->table1_id = $table1->id; // Assuming there's a foreign key relationship
        //$table2->save();


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
            $student->image = $relativeImagePath;
        }
        $student->save();

        // Return a response if needed
        return response()->json(['message' => 'Data received successfully']);
    }

else {
    return response()->json(['message' => 'Data Already in DB']);
}
   
}
}
