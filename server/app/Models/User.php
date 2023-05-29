<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable;

class user extends Model
{
    use HasFactory;
    protected $table = 'user';
    protected $primaryKey = 'user_id';
    protected $fillable = [
        'user_id',
        'email',
        'password',
        'role',
        'status',
        'created_by',
        'updated_by',
    ];
}
