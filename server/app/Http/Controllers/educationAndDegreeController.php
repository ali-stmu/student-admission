<?php

namespace App\Http\Controllers;

use App\Models\Education;
use App\Models\Document;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Student;

class EducationAndDegreeController extends Controller
{



    public function storeDegreeAndDocument(Request $request)
    {


        Log::debug($jsonData = $request->all());
        $education = new Education();
        //$education->student_id = $this->findStudent(); // Use the findStudent() method to get the student_id

        foreach ($jsonData['records'] as $record) {

            $education->qualification = $record['qualification'];
            $education->institution_name = $record['boardUniversity'];
            // Set other attributes accordingly

            $education->save();

            if ($record['degree']) {
                $document = new Document();
                $document->student_id = $this->findStudent(); // Use the findStudent() method to get the student_id
                $document->document_name = 'Degree';
                $document->document_file_name = $record['degree']->getClientOriginalName();
                // Set other attributes accordingly

                // Move the uploaded file to a desired location
                $record['degree']->move('path/to/store/files', $document->document_file_name);

                $document->save();
            }
        }
        return response()->json(['message' => 'Data stored successfully']);
    }
}
