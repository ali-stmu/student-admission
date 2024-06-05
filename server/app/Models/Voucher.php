<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $table = "voucher";
    protected $primaryKey = "voucher_id";

    protected $fillable = [
        'student_id',
        'voucher_code',
        'voucher_file_name',
        'upload_date',
        'bank_name',
        'branch_code',
        'transaction_id',
        'mode_of_payment',
        'program_id',
        'application_status',
        'status',
        'session_id',

    ];

    // Rest of your model code...
}

