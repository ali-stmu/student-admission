<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class student extends Model
{
    use HasFactory;
    protected $table = 'student';
    protected $primaryKey = 'student_id';
    protected $fillable = [
        'student_id',
        'user_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'phone_number',
        'email_address',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'status',
        'created_at',
        'updated_at', 'created_by', 'updated_by', 'relegion',
        'mother_name', 'father_name', 'father_contact', 'father_occupation',
        'passport_number', 'family_member',
        't_address',
        't_city',
        't_state',
        't_zip_code',
        't_country',
        'land_line',
        'image',
        'cnic',
        'religion'


    ];
}
