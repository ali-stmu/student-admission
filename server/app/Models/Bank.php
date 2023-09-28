<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    protected $table = 'bank'; // If you have a specific table name

    protected $fillable = [
        'bank_name',
        'account_number',
        'account_title',
    ];

}
