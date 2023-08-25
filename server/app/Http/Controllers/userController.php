<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\user;
use Illuminate\Support\Str;
class userController extends Controller
{
    //



    function register(Request $request)
    {
        $email = $request->input('email');
        $cnic = $request->input('cnic'); // If CNIC is included in the request
        
        // Check if either email or CNIC already exists in the database
        $userExists = User::where('email', $email)->orWhere('cnic', $cnic)->exists();
        if ($userExists) {
            return response()->json(['error' => 'Email or CNIC already exists.'], 400);
        }
    
        $user = new User;
        $password = Str::random(12);
        $user->role = "Student";
        $user->status = "Active";
        $user->created_by = $email;
        $user->email = $email;
        $user->password = bcrypt($password);
    
        if ($cnic) {
            $user->cnic = $cnic; // Save CNIC if provided
        }
    
        $user->save();
    
        $passwordWithMessage = 'This is your Password: ' . $password;
        Mail::raw(($passwordWithMessage), function ($message) use ($email) {
            $message->to($email);
            $message->subject('Your Password');
        });
    
        return response()->json(['message' => 'Password created and sent to email.']);
    }



    
}
