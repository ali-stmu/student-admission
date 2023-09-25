<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'student_id',
        'voucher_code',
        'voucher_file_name',
        'upload_date',
    ];

    // Rest of your model code...
}

