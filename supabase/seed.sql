-- ==============================================================================
-- Student Cover Page Maker: Seed Data for Templates
-- Matches exact technical specification in design.md
-- ==============================================================================

-- 1. Standard Institutional A4 Template (NIT / IIT / Engineering Institute Format)
INSERT INTO templates (id, name, preview_image_url, field_schema, html_template)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Standard Institutional A4',
  '/templates/standard-a4.png',
  '[
    {"name": "institutionName", "label": "Institution Name", "type": "text", "required": true, "placeholder": "NATIONAL INSTITUTE OF TECHNOLOGY", "section": "personal"},
    {"name": "department", "label": "Department Name", "type": "text", "required": true, "placeholder": "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", "section": "course"},
    {"name": "submissionType", "label": "Submission Type", "type": "text", "required": true, "placeholder": "LAB REPORT / PRACTICAL RECORD", "section": "assignment"},
    {"name": "assignmentTitle", "label": "Assignment Title", "type": "text", "required": true, "placeholder": "Implementation & Benchmarking of Raft Consensus in Distributed Environments", "section": "assignment"},
    {"name": "assignmentSubtitle", "label": "Assignment Subtitle (Optional)", "type": "text", "required": false, "placeholder": "Practical Laboratory Session 04 - High-Availability Clusters", "section": "assignment"},
    {"name": "subjectCode", "label": "Subject Code", "type": "text", "required": true, "placeholder": "CS-504", "section": "course"},
    {"name": "subject", "label": "Subject Name", "type": "text", "required": true, "placeholder": "Distributed Systems & Cloud Computing", "section": "course"},
    {"name": "semester", "label": "Semester / Session", "type": "text", "required": true, "placeholder": "Semester V (Autumn 2024)", "section": "course"},
    {"name": "fullName", "label": "Student Full Name", "type": "text", "required": true, "placeholder": "Alex Morgan", "section": "personal"},
    {"name": "rollNo", "label": "Roll Number", "type": "text", "required": true, "placeholder": "CS22B1044", "section": "personal"},
    {"name": "studentId", "label": "Student ID", "type": "text", "required": true, "placeholder": "STU-2022-84920", "section": "personal"},
    {"name": "registrationNo", "label": "Registration No.", "type": "text", "required": false, "placeholder": "REG-8829104", "section": "personal"},
    {"name": "facultyName", "label": "Faculty / Instructor Name", "type": "text", "required": true, "placeholder": "Dr. Evelyn Vance, Ph.D.", "section": "faculty"},
    {"name": "facultyDesignation", "label": "Faculty Designation", "type": "text", "required": true, "placeholder": "Associate Professor & Head of Lab", "section": "faculty"},
    {"name": "secondFacultyName", "label": "Second Faculty Name (Optional)", "type": "text", "required": false, "placeholder": "Prof. Marcus Thorne", "section": "faculty"},
    {"name": "secondFacultyDesignation", "label": "Second Faculty Designation (Optional)", "type": "text", "required": false, "placeholder": "Assistant Professor", "section": "faculty"},
    {"name": "submissionDate", "label": "Submission Date", "type": "date", "required": true, "placeholder": "2024-11-05", "section": "assignment"}
  ]'::jsonb,
  '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 25mm 20mm 20mm 20mm; }
  body { font-family: "Times New Roman", Times, serif; color: #111; margin: 0; padding: 0; box-sizing: border-box; }
  .header { text-align: center; border-bottom: 2px solid #800020; padding-bottom: 15px; margin-bottom: 30px; }
  .logo { width: 70px; height: 70px; margin: 0 auto 10px; }
  .inst { font-size: 18pt; font-weight: bold; text-transform: uppercase; color: #800020; letter-spacing: 1px; }
  .dept { font-size: 12pt; text-transform: uppercase; color: #333; margin-top: 5px; }
  .sub-type { text-align: center; font-size: 13pt; font-weight: bold; letter-spacing: 2px; color: #555; margin-top: 40px; text-transform: uppercase; }
  .title-box { text-align: center; margin: 30px 0 50px 0; }
  .title { font-size: 20pt; font-weight: bold; line-height: 1.3; color: #000; }
  .subtitle { font-size: 13pt; font-style: italic; color: #444; margin-top: 10px; }
  .course-box { text-align: center; font-size: 12pt; color: #333; margin-bottom: 60px; }
  .grid { display: flex; justify-content: space-between; margin-top: auto; padding-top: 30px; border-top: 1px solid #ccc; font-family: Arial, sans-serif; font-size: 10pt; }
  .col { width: 48%; }
  .col-right { text-align: right; }
  .label { font-weight: bold; color: #800020; text-transform: uppercase; font-size: 9pt; margin-bottom: 4px; }
  .val { margin-bottom: 3px; }
  .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 9pt; font-family: Arial, sans-serif; border-top: 1px dashed #999; padding-top: 15px; }
  .sig-line { width: 180px; border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; text-align: center; font-size: 8pt; font-weight: bold; }
</style>
</head>
<body>
  <div class="header">
    {{logoHtml}}
    <div class="inst">{{institutionName}}</div>
    <div class="dept">{{department}}</div>
  </div>
  <div class="sub-type">{{submissionType}}</div>
  <div class="title-box">
    <div class="title">{{assignmentTitle}}</div>
    {{#assignmentSubtitle}}<div class="subtitle">{{assignmentSubtitle}}</div>{{/assignmentSubtitle}}
  </div>
  <div class="course-box">
    <strong>Subject:</strong> {{subjectCode}} &mdash; {{subject}}<br>
    <strong>Session:</strong> {{semester}}
  </div>
  <div class="grid">
    <div class="col">
      <div class="label">Submitted By:</div>
      <div class="val" style="font-size: 12pt; font-weight: bold;">{{fullName}}</div>
      <div class="val"><strong>Roll No:</strong> {{rollNo}}</div>
      <div class="val"><strong>Student ID:</strong> {{studentId}}</div>
      {{#registrationNo}}<div class="val"><strong>Reg No:</strong> {{registrationNo}}</div>{{/registrationNo}}
    </div>
    <div class="col col-right">
      <div class="label">Submitted To:</div>
      <div class="val" style="font-size: 12pt; font-weight: bold;">{{facultyName}}</div>
      <div class="val">{{facultyDesignation}}</div>
      {{#secondFacultyName}}
      <div style="margin-top: 10px;">
        <div class="val" style="font-weight: bold;">{{secondFacultyName}}</div>
        <div class="val">{{secondFacultyDesignation}}</div>
      </div>
      {{/secondFacultyName}}
      <div class="val" style="margin-top: 10px;"><strong>Date:</strong> {{submissionDate}}</div>
    </div>
  </div>
  <div class="footer">
    <div class="sig-line">STUDENT SIGNATURE</div>
    <div class="sig-line">FACULTY EVALUATION & MARKS</div>
  </div>
</body>
</html>'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  field_schema = EXCLUDED.field_schema,
  html_template = EXCLUDED.html_template;

-- 2. Modern Academic Minimal Template (Harvard / APA 7 Style)
INSERT INTO templates (id, name, preview_image_url, field_schema, html_template)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Modern Academic Minimal',
  '/templates/academic-minimal.png',
  '[
    {"name": "assignmentTitle", "label": "Paper / Essay Title", "type": "text", "required": true, "placeholder": "Rethinking Epistemic Authority in Networked Democracies", "section": "assignment"},
    {"name": "assignmentSubtitle", "label": "Subtitle", "type": "text", "required": false, "placeholder": "A Critical Inquiry in Philosophy of Technology", "section": "assignment"},
    {"name": "fullName", "label": "Author Full Name", "type": "text", "required": true, "placeholder": "Claire Devereux", "section": "personal"},
    {"name": "institutionName", "label": "Department & Institution", "type": "text", "required": true, "placeholder": "Department of Philosophy, University of Cambridge", "section": "personal"},
    {"name": "subject", "label": "Course Name", "type": "text", "required": true, "placeholder": "PHIL-3100: Philosophy of Science & Politics", "section": "course"},
    {"name": "facultyName", "label": "Instructor / Advisor", "type": "text", "required": true, "placeholder": "Prof. Julian Sterling", "section": "faculty"},
    {"name": "submissionDate", "label": "Due Date", "type": "date", "required": true, "placeholder": "2024-10-24", "section": "assignment"}
  ]'::jsonb,
  '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: letter; margin: 1in; }
  body { font-family: "Georgia", serif; color: #1a1a1a; line-height: 2; margin: 0; padding: 0; display: flex; flex-direction: column; min-height: 100vh; }
  .header-num { text-align: right; font-size: 10pt; font-family: "Courier New", monospace; }
  .content { margin: auto 0; text-align: center; }
  .title { font-size: 22pt; font-weight: bold; line-height: 1.3; margin-bottom: 10px; }
  .subtitle { font-size: 14pt; font-style: italic; color: #444; margin-bottom: 50px; }
  .meta { font-size: 12pt; }
  .meta div { margin-bottom: 4px; }
</style>
</head>
<body>
  <div class="header-num">1</div>
  <div class="content">
    <div class="title">{{assignmentTitle}}</div>
    {{#assignmentSubtitle}}<div class="subtitle">{{assignmentSubtitle}}</div>{{/assignmentSubtitle}}
    <div class="meta">
      <div>{{fullName}}</div>
      <div>{{institutionName}}</div>
      <div>{{subject}}</div>
      <div>{{facultyName}}</div>
      <div>{{submissionDate}}</div>
    </div>
  </div>
</body>
</html>'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  field_schema = EXCLUDED.field_schema,
  html_template = EXCLUDED.html_template;

-- 3. Technical Laboratory Formal Template (Scientific Lab Report)
INSERT INTO templates (id, name, preview_image_url, field_schema, html_template)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Technical Laboratory Formal',
  '/templates/technical-lab.png',
  '[
    {"name": "institutionName", "label": "Department / Laboratory", "type": "text", "required": true, "placeholder": "Department of Chemical Physics & Analytical Core", "section": "personal"},
    {"name": "assignmentTitle", "label": "Experiment Title", "type": "text", "required": true, "placeholder": "Spectrophotometric Determination of Reaction Kinetics", "section": "assignment"},
    {"name": "experimentNo", "label": "Experiment Number", "type": "text", "required": true, "placeholder": "EXP-088", "section": "assignment"},
    {"name": "benchNo", "label": "Bench / Station ID", "type": "text", "required": true, "placeholder": "Station #12", "section": "assignment"},
    {"name": "batchGroup", "label": "Batch / Group", "type": "text", "required": true, "placeholder": "B4-Group 3", "section": "course"},
    {"name": "fullName", "label": "Lead Investigator", "type": "text", "required": true, "placeholder": "Marcus Thorne", "section": "personal"},
    {"name": "rollNo", "label": "Student ID / Roll", "type": "text", "required": true, "placeholder": "2024-ME-091", "section": "personal"},
    {"name": "facultyName", "label": "Assigned Supervisor", "type": "text", "required": true, "placeholder": "Prof. A. Lindqvist", "section": "faculty"},
    {"name": "submissionDate", "label": "Performance Date", "type": "date", "required": true, "placeholder": "2024-10-24", "section": "assignment"}
  ]'::jsonb,
  '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 20mm; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #222; margin: 0; padding: 0; }
  .border-box { border: 2px solid #222; padding: 25px; min-height: 90vh; display: flex; flex-direction: column; justify-content: space-between; }
  .top-bar { display: flex; justify-content: space-between; font-size: 10pt; font-family: monospace; border-bottom: 1px solid #222; padding-bottom: 10px; }
  .exp-badge { background: #800020; color: #fff; padding: 3px 8px; font-weight: bold; }
  .center-content { text-align: center; margin: 60px 0; }
  .report-tag { font-size: 11pt; letter-spacing: 3px; font-weight: bold; color: #666; }
  .title { font-size: 22pt; font-weight: 800; margin: 15px 0; }
  .table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 10pt; }
  .table td { border: 1px solid #999; padding: 10px 12px; }
  .table .label-td { background: #f5f5f5; font-weight: bold; width: 30%; }
  .sign-area { display: flex; justify-content: space-between; margin-top: 50px; font-size: 9pt; }
  .sign-box { width: 45%; border-top: 1px solid #333; padding-top: 6px; text-align: center; }
</style>
</head>
<body>
  <div class="border-box">
    <div class="top-bar">
      <div>{{institutionName}}</div>
      <div class="exp-badge">EXP NO: {{experimentNo}}</div>
    </div>
    <div class="center-content">
      <div class="report-tag">STANDARD LABORATORY REPORT</div>
      <div class="title">{{assignmentTitle}}</div>
    </div>
    <table class="table">
      <tr>
        <td class="label-td">Lead Investigator</td>
        <td>{{fullName}} (ID: {{rollNo}})</td>
      </tr>
      <tr>
        <td class="label-td">Batch / Workstation</td>
        <td>Batch: {{batchGroup}} | Bench: {{benchNo}}</td>
      </tr>
      <tr>
        <td class="label-td">Assigned Supervisor</td>
        <td>{{facultyName}}</td>
      </tr>
      <tr>
        <td class="label-td">Date Conducted</td>
        <td>{{submissionDate}}</td>
      </tr>
    </table>
    <div class="sign-area">
      <div class="sign-box">STUDENT SIGNATURE</div>
      <div class="sign-box">FACULTY VERIFICATION & LAB GRADE</div>
    </div>
  </div>
</body>
</html>'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  field_schema = EXCLUDED.field_schema,
  html_template = EXCLUDED.html_template;
