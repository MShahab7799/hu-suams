import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const UserRoles = [
  'Admin', 'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
  'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
  'Student', 'Teacher', 'Parent', 'Visitor', 'Alumni'
];

async function main() {
  console.log('Seeding Hazara University SUAMS Database...');

  // 1. Clear existing data
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.timeSlot.deleteMany({});
  await prisma.assistant.deleteMany({});
  await prisma.official.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.faculty.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});

  // 2. Create Roles
  for (const roleName of UserRoles) {
    await prisma.role.create({
      data: {
        name: roleName,
        description: `${roleName} role for SUAMS Portal`,
      },
    });
  }

  // 3. Create Faculties
  const facultiesData = [
    {
      id: 'ncs',
      name: 'Faculty of Natural & Computational Sciences',
      shortName: 'Natural & Computational Sciences',
      icon: '⚛️',
      color: '#4CAF50',
      departments: [
        {
          name: 'Computer Science',
          shortName: 'CS',
          programs: [
            { name: 'BS Computer Science', degree: 'BS', duration: 8 },
            { name: 'BS Information Technology', degree: 'BS', duration: 8 },
            { name: 'BS Software Engineering', degree: 'BS', duration: 8 },
            { name: 'BS Data Science', degree: 'BS', duration: 8 },
            { name: 'BS Cyber Security', degree: 'BS', duration: 8 },
          ]
        },
        {
          name: 'Artificial Intelligence',
          shortName: 'AI',
          programs: [
            { name: 'BS Artificial Intelligence', degree: 'BS', duration: 8 },
          ]
        },
        {
          name: 'Mathematics',
          shortName: 'Math',
          programs: [
            { name: 'BS Mathematics', degree: 'BS', duration: 8 },
          ]
        },
        {
          name: 'Physics',
          shortName: 'Physics',
          programs: [
            { name: 'BS Physics', degree: 'BS', duration: 8 },
          ]
        },
        {
          name: 'Chemistry',
          shortName: 'Chemistry',
          programs: [
            { name: 'BS Chemistry', degree: 'BS', duration: 8 },
          ]
        }
      ]
    },
    {
      id: 'bhs',
      name: 'Faculty of Biological & Health Sciences',
      shortName: 'Biological & Health Sciences',
      icon: '🧬',
      color: '#00BCD4',
      departments: [
        {
          name: 'Botany',
          shortName: 'Botany',
          programs: [
            { name: 'BS Botany', degree: 'BS', duration: 8 },
          ]
        },
        {
          name: 'Zoology',
          shortName: 'Zoology',
          programs: [
            { name: 'BS Zoology', degree: 'BS', duration: 8 },
          ]
        },
        {
          name: 'Pharmacy',
          shortName: 'Pharmacy',
          programs: [
            { name: 'Doctor of Pharmacy (Pharm-D)', degree: 'Pharm-D', duration: 10 },
          ]
        }
      ]
    },
    {
      id: 'lss',
      name: 'Faculty of Law & Social Sciences',
      shortName: 'Law & Social Sciences',
      icon: '⚖️',
      color: '#FF9800',
      departments: [
        {
          name: 'Economics',
          shortName: 'Economics',
          programs: [
            { name: 'BS Economics', degree: 'BS', duration: 8 },
          ]
        },
        {
          name: 'Business Administration',
          shortName: 'BBA',
          programs: [
            { name: 'BBA', degree: 'BBA', duration: 8 },
          ]
        },
        {
          name: 'Law',
          shortName: 'Law',
          programs: [
            { name: 'LLB', degree: 'LLB', duration: 10 },
          ]
        }
      ]
    },
    {
      id: 'ah',
      name: 'Faculty of Arts & Humanities',
      shortName: 'Arts & Humanities',
      icon: '🎨',
      color: '#9C27B0',
      departments: [
        {
          name: 'English',
          shortName: 'English',
          programs: [
            { name: 'BS English', degree: 'BS', duration: 8 },
          ]
        }
      ]
    }
  ];

  for (const fac of facultiesData) {
    const faculty = await prisma.faculty.create({
      data: {
        id: fac.id,
        name: fac.name,
        shortName: fac.shortName,
        icon: fac.icon,
        color: fac.color,
      },
    });

    for (const dept of fac.departments) {
      const department = await prisma.department.create({
        data: {
          name: dept.name,
          shortName: dept.shortName,
          facultyId: faculty.id,
        },
      });

      for (const prog of dept.programs) {
        await prisma.program.create({
          data: {
            name: prog.name,
            shortName: prog.name.split(' ').slice(1).join(' ') || prog.name,
            departmentId: department.id,
            degree: prog.degree,
            duration: prog.duration,
          },
        });
      }
    }
  }

  // 4. Create Default Users & Officials
  const passwordHash = await bcrypt.hash('Password123!', 12);

  // Admin User
  await prisma.user.create({
    data: {
      fullName: 'System Administrator',
      email: 'admin@hu.edu.pk',
      passwordHash,
      role: 'Admin',
      isEmailVerified: true,
    },
  });

  // Student User
  const student = await prisma.user.create({
    data: {
      fullName: 'Ali Ahmed',
      email: 'student@hu.edu.pk',
      passwordHash,
      role: 'Student',
      universityId: '2023-CS-1234',
      isEmailVerified: true,
      gender: 'Male',
      semester: 4,
    },
  });

  // Vice Chancellor Official
  const vcUser = await prisma.user.create({
    data: {
      fullName: 'Prof. Dr. Mohsin Khan',
      email: 'vc@hu.edu.pk',
      passwordHash,
      role: 'ViceChancellor',
      isEmailVerified: true,
      gender: 'Male',
    },
  });

  const vcOfficial = await prisma.official.create({
    data: {
      userId: vcUser.id,
      title: 'Vice Chancellor',
      officeLocation: 'VC Block, Main Campus',
      officeHours: 'Monday – Wednesday, 10:00 AM – 12:00 PM',
      bio: 'The Vice Chancellor is the principal academic and administrative officer of Hazara University.',
      appointmentDurationMins: 30,
      isAvailable: true,
      maxDailyAppointments: 5,
    },
  });

  // VC TimeSlots
  const vcSlots = ['10:00', '10:30', '11:00', '11:30'];
  for (const slot of vcSlots) {
    const [h, m] = slot.split(':').map(Number);
    const endMinutes = h * 60 + m + 30;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    for (let day = 1; day <= 3; day++) { // Mon, Tue, Wed
      await prisma.timeSlot.create({
        data: {
          officialId: vcOfficial.id,
          dayOfWeek: day,
          startTime: slot,
          endTime,
        },
      });
    }
  }

  // Registrar Official
  const regUser = await prisma.user.create({
    data: {
      fullName: 'Dr. Shahzad Rahman',
      email: 'registrar@hu.edu.pk',
      passwordHash,
      role: 'Registrar',
      isEmailVerified: true,
      gender: 'Male',
    },
  });

  const regOfficial = await prisma.official.create({
    data: {
      userId: regUser.id,
      title: 'Registrar',
      officeLocation: 'Admin Block, Ground Floor',
      officeHours: 'Monday – Friday, 9:00 AM – 2:00 PM',
      bio: 'The Registrar oversees academic records, admissions, and student services.',
      appointmentDurationMins: 20,
      isAvailable: true,
      maxDailyAppointments: 15,
    },
  });

  // Reg TimeSlots
  const regSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '13:00'];
  for (const slot of regSlots) {
    const [h, m] = slot.split(':').map(Number);
    const endMinutes = h * 60 + m + 20;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    for (let day = 1; day <= 5; day++) { // Mon-Fri
      await prisma.timeSlot.create({
        data: {
          officialId: regOfficial.id,
          dayOfWeek: day,
          startTime: slot,
          endTime,
        },
      });
    }
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
