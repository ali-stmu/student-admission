<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CCN extends Model
{
    protected $table = 'ccn';

    protected $fillable = [
        'user_id',
        'candidate_name',
        'father_name',
        'phone_number',
        'email',
        'cnic_passport_picture',
        'candidate_picture',
        'mailing_address',
        'highest_degree_picture',
        'highest_degree_title',
        'professional_reg_number',
        'status',
        'voucher_image_path',
        'term_id',
    ];

    // Add relationships or additional methods here if needed
}
