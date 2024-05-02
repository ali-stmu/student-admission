<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admit Card</title>
    <style>
        /* Add your CSS styles for the admit card here */
        body {
            font-family: 'Times New Roman', Times, serif, sans-serif;
        }

        .admit-card {
            width: 100%;
            border: 1px solid #000;
            padding: 10px;
            margin: 10px auto;

            /* Center aligning the content of the admit card */

        }

        .admit-card h2,
        .admit-card h3 {
            text-align: center;
            /* Center aligning the specified headings */
            margin-bottom: 10px;
        }

        .admit-card p {
            margin-bottom: 5px;
        }

        .p-center {
            text-align: center;
        }

        .admit-card li {
            font-size: 13px;
        }

        .detail-box {
            border: 1px solid #000;
            padding: 10px;
            margin: 10px;
        }

        .picture-box {
            position: fixed;
            top: 30px;
            right: 10px;
            width: 120px;
            /* Adjust width and height as needed */
            height: 120px;
            border: 1px solid #000;
            /* Add any other styling you desire */
        }
    </style>
</head>

<body>

    <div class="admit-card">
        <div class="picture-box">
            <img style="max-height: 150px" src="{{ $data['student_img'] ?? '' }}">
        </div>
        <h2>Shifa Tameer-e-Millat University</h2>
        <h3>Admit Card</h3>
        <h3>{{ $data['program_name'] ?? '' }}</h3>
        <p class="p-center">For Intake Year: Fall-2024</p>
        <div class="detail-box">
            <p><strong>Program Name:</strong> {{ $data['program_name'] ?? '' }}</p>
            <p><strong>Test Date:</strong> Saturday, May 25<sup>th</sup> , 2024</p>
            <p><strong>Reporting Time:</strong> 08:00 AM</p>
            <p><strong>Test Time:</strong> 09:00 AM</p>
            <p><strong>Venue:</strong> National Testing Service (NTS) Plot # 96, Street 4, Sector H-8/1
                Islamabad. Ph. No: 051-844444-1</p>
            <p><strong>Entrance Test Roll No:</strong> BSN-2024-{{ $data['student_id'] ?? ('' ?? '') }}</p>
            <p><strong>Candidate Name:</strong> {{ $data['student_first_name'] ?? '' }}
                {{ $data['student_last_name'] ?? '' }}</p>
            <p><strong>Father's Name:</strong> {{ $data['father_name'] ?? ('' ?? '') }}</p>
            <p><strong>CNIC No:</strong> {{ $data['cnic'] ?? ('' ?? '') }}</p>
        </div>
        <p><strong>General Instructions:</strong></p>
        <ol>
            <li>Bring your original CNIC/B-Form, admit card & paid fee voucher for the test.</li>
            <li>Make sure you reach test venue at sharp.</li>
            <li>Once inside the test venue mark your attendance on the registration desk and follow the instructions to
                find the seat marked with your test roll no.</li>
            <li>Once the test is complete, remain seated until otherwise guided by invigilation staff.</li>
            <li>You would be provided an Optical Mark Reader (OMR) sheet at the start of the test. Mark your test roll
                no on it. You may use any blue or black ball pen/lead pencil to mark your roll number and the answers on
                the sheet.</li>
            <li>Mark your attendance and write down your roll no and OMR sheet no on the attendance sheet provided to
                you in the examination hall.</li>
            <li>Do not overwrite or mark multiple answers. Ensure that circles on the OMR are filled completely.</li>
            <li>Do not signal or talk to any other candidate. Any non-compliance would result in disqualification to
                appear in the test.</li>
            <li>Please bring stationary (Clipboard, Pencil, and black ball pen to fill the OMR Sheet).</li>
        </ol>
        <p><strong>Test Pattern:</strong></p>
        <ol>
            <li>The test comprises of 70 MCQ’s that are to be completed within 01 hour & 30 minutes.</li>
            <li>The test comprises of 04 sections - English, Science, Math, and Analytical Reasoning.</li>
            <li>All questions carry equal marks (1 mark each). There is NO negative marking in the paper.</li>
        </ol>
        <p><strong>Note:</strong></p>
        <ul>
            <li>Entry without Admit card & CNIC is not allowed.</li>
            <li>Electronic gadgets / mobiles/calculator are not allowed.</li>
            <li>Relatives OR Family members are NOT allowed inside the test campus.</li>
        </ul>
    </div>
</body>

</html>
