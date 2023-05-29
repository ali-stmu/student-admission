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
        $users =new user;
      
        $password = Str::random(12); // Generate a random string of 12 characters
        $users->role="Student";
        $users->status="Active";
        $users->created_by=$request->input('email');
        $users->email=$request->input('email');
   
        $passwordWithMessage = 'This is your Password: ' . $password;
        $passwordEncrypted= bcrypt($password);
        $users->password=$passwordEncrypted;
        $users->save();
      $emailForSend=$request->input('email');

        // Send email with new password
    
       // Mail::send('resetpassword', ['password' => $password], function ($message) use ($emailForSend) {
          //  $message->to($emailForSend)->subject('Your new password');
      //  });

        $message = 'Hello, this is a test email!';
        Mail::raw(($passwordWithMessage), function ($message) use ($emailForSend) {
            $message->to($emailForSend);
            $message->subject('Your Password');
        });



        return response()->json(['message' => 'Password created and sent to email.']);
   
       // Send email with new password
    


      
   
      
   }



    
}
