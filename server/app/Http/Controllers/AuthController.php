<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    //
    public function getUserDetails($email) {
        $user = User::find($email);
        $details = DB::table('user')->where('email', $email)->first();
        $data = [
          'user' => $user,
          'details' => $details
        ];
        log::debug($data);
        return response()->json($data, 200);
      }

    function SignIn(Request $request)
    { 
        $email=$request->input('email');
        $password=$request->input('password');
        $user = User::where('email', $email)->first();

        if ($user && Hash::check($password, $user->password)) {
            
                log::debug("matched");
                $data = [
                    'message' => 'Matched'
                  ];
                //return response()->json($data, 200);
          return response()->json($this->getUserDetails($email),200);
            
            }
           else {
            $data = [
                'error' => 'Invalid'
              ];
            return response()->json($data, 400);
            // Password does not match
            response()->json(['Error' => 'Invalid Email or Password']);
          }
    }
  


    
}
