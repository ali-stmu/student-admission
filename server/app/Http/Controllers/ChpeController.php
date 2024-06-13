<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChpeForm;

class ChpeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'candidateName' => 'required|string|max:255',
            'user_id' => 'required|string|max:255',
            'fatherName' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:20',
            'email' => 'required|string|email|max:255',
            'mailingAddress' => 'required|string',
            'professionalRegNumber' => 'nullable|string|max:100',
            'cnicPicture' => 'required|image|max:10240', // max 10MB
            'candidatePicture' => 'required|image|max:10240', // max 10MB
            'highestDegreePicture' => 'required|image|max:10240', // max 10MB
        ]);

        // Handle file uploads
        $cnicPicturePath = $request->file('cnicPicture')->store('public/images/cnicPicture');
        $candidatePicturePath = $request->file('candidatePicture')->store('public/images/candidatePicture');
        $highestDegreePicturePath = $request->file('highestDegreePicture')->store('public/images/highestDegreePicture');

        // Save form data to database
        $chpeForm = new ChpeForm();
        $chpeForm->candidate_name = $validatedData['candidateName'];
        $chpeForm->user_id = $validatedData['user_id'];
        $chpeForm->father_name = $validatedData['fatherName'];
        $chpeForm->phone_number = $validatedData['phoneNumber'];
        $chpeForm->email = $validatedData['email'];
        $chpeForm->mailing_address = $validatedData['mailingAddress'];
        $chpeForm->professional_reg_number = $validatedData['professionalRegNumber'];
        $chpeForm->cnic_passport_picture = $cnicPicturePath;
        $chpeForm->candidate_picture = $candidatePicturePath;
        $chpeForm->highest_degree_picture = $highestDegreePicturePath;
        $chpeForm->save();

        return response()->json(['message' => 'Form submitted successfully'], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
