import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@greenfieldacademy.edu" },
    update: {},
    create: {
      email: "admin@greenfieldacademy.edu",
      passwordHash: hashedPassword,
      name: "Site Administrator",
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Posts
  await prisma.post.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Greenfield Academy Wins Regional Science Fair",
        slug: "science-fair-2024",
        content: "<p>We are thrilled to announce that our students swept the regional science fair, taking home 5 gold medals across various categories. The judges were particularly impressed by the robotics and environmental science projects.</p><p>This achievement reflects the dedication of our students and the outstanding mentorship of our science faculty.</p>",
        excerpt: "Our students swept the regional science fair, taking home 5 gold medals across various categories.",
        published: true,
        authorId: admin.id,
      },
      {
        title: "New STEM Lab Opening Ceremony Set for Next Month",
        slug: "stem-lab-opening",
        content: "<p>Greenfield Academy is proud to announce the opening of our brand-new, state-of-the-art STEM laboratory. This facility, equipped with the latest technology, will serve students across all grade levels.</p><p>The opening ceremony is scheduled for the 15th of next month and will be attended by local officials and educational leaders.</p>",
        excerpt: "Our new state-of-the-art STEM laboratory opens next month with the latest technology.",
        published: true,
        authorId: admin.id,
      },
      {
        title: "Annual Sports Day: A Celebration of Teamwork",
        slug: "annual-sports-day-2024",
        content: "<p>This year's Annual Sports Day was a tremendous success, with over 800 students, parents, and staff participating in a full day of athletic competition and community spirit.</p><p>Events ranged from track and field to team sports, culminating in a closing ceremony that celebrated every participant.</p>",
        excerpt: "Over 800 participants joined us for a full day of athletic competition and community spirit.",
        published: true,
        authorId: admin.id,
      },
    ],
  });
  console.log("✅ Posts seeded");

  // Events
  const now = new Date();
  await prisma.event.createMany({
    skipDuplicates: false,
    data: [
      {
        title: "Open House & Campus Tour",
        description: "Prospective families are invited to tour our campus, meet our teachers, and learn about our programs. Register online to secure your spot.",
        date: new Date(now.getFullYear(), now.getMonth() + 1, 15, 9, 0),
        location: "Main Campus, Greenfield Academy",
      },
      {
        title: "Annual Science & Technology Expo",
        description: "Students showcase their science and technology projects to parents, teachers, and community judges. Come support our budding scientists and engineers!",
        date: new Date(now.getFullYear(), now.getMonth() + 1, 22, 10, 0),
        location: "School Gymnasium",
      },
      {
        title: "Graduation Ceremony 2024",
        description: "Join us in celebrating the Class of 2024 as they take the next step in their educational journey. Family and friends are welcome.",
        date: new Date(now.getFullYear(), now.getMonth() + 2, 10, 14, 0),
        location: "School Auditorium",
      },
    ],
  });
  console.log("✅ Events seeded");

  // Staff
  await prisma.staff.createMany({
    skipDuplicates: false,
    data: [
      { name: "Dr. Margaret Osei", role: "Principal", department: "Administration", bio: "Dr. Osei has over 25 years of experience in education and is passionate about creating inclusive learning environments.", order: 1 },
      { name: "Mr. James Adeyemi", role: "Vice Principal", department: "Administration", bio: "Mr. Adeyemi oversees academic affairs and student welfare, bringing 18 years of teaching and leadership experience.", order: 2 },
      { name: "Mrs. Sarah Mensah", role: "Head of Science", department: "Science", bio: "Mrs. Mensah leads our Science department with a focus on hands-on, inquiry-based learning.", order: 3 },
      { name: "Mr. Kwame Boateng", role: "Head of Mathematics", department: "Mathematics", bio: "Mr. Boateng is renowned for making complex mathematical concepts accessible and engaging for all students.", order: 4 },
      { name: "Ms. Abena Asante", role: "Head of Languages", department: "Languages", bio: "Ms. Asante oversees English and French programmes, fostering a love of literature and communication.", order: 5 },
      { name: "Mr. David Okonkwo", role: "Sports Director", department: "Physical Education", bio: "Mr. Okonkwo manages all athletic programs and has led our teams to numerous regional championships.", order: 6 },
    ],
  });
  console.log("✅ Staff seeded");

  // Page Content
  await prisma.pageContent.createMany({
    skipDuplicates: true,
    data: [
      {
        page: "ABOUT",
        section: "history",
        content: "<p>Founded in 1985, Greenfield Academy began as a small community school with a vision to provide world-class education to every child. Over four decades, we have grown into a leading institution serving over 1,200 students from Kindergarten through Grade 12.</p><p>Our campus has expanded from a single building to a sprawling 15-acre property featuring modern classrooms, science labs, a library, sports facilities, and performing arts spaces.</p>",
      },
      {
        page: "ABOUT",
        section: "mission",
        content: "<p>Our mission is to nurture intellectually curious, socially responsible, and globally aware individuals by providing a rigorous, inclusive, and inspiring educational experience.</p>",
      },
      {
        page: "ABOUT",
        section: "vision",
        content: "<p>We envision a learning community where every student discovers their unique potential, develops 21st-century skills, and graduates ready to make a positive impact on the world.</p>",
      },
      {
        page: "ACADEMICS",
        section: "overview",
        content: "<p>At Greenfield Academy, we offer a comprehensive curriculum designed to challenge and inspire students at every level. Our programmes blend academic rigor with creative thinking, technology integration, and real-world application.</p>",
      },
      {
        page: "ACADEMICS",
        section: "programs",
        content: "<ul><li><strong>Primary School (K–Grade 6):</strong> A holistic foundation in literacy, numeracy, sciences, arts, and physical education.</li><li><strong>Middle School (Grades 7–9):</strong> Deep dives into core subjects with introduction to electives and extracurriculars.</li><li><strong>High School (Grades 10–12):</strong> Advanced coursework, AP courses, and university preparation programmes.</li></ul>",
      },
      {
        page: "ADMISSIONS",
        section: "overview",
        content: "<p>We welcome applications from families who share our commitment to academic excellence and character development. Our admissions process is designed to be transparent, fair, and supportive.</p>",
      },
      {
        page: "ADMISSIONS",
        section: "process",
        content: "<ol><li>Complete and submit the online application form.</li><li>Submit required academic records and transcripts.</li><li>Attend an assessment day (for Grades 4 and above).</li><li>Family interview with the admissions team.</li><li>Receive your admission decision within 2 weeks.</li></ol>",
      },
      {
        page: "ADMISSIONS",
        section: "requirements",
        content: "<ul><li>Completed application form</li><li>Copy of birth certificate</li><li>Previous school reports (last 2 years)</li><li>Passport-sized photographs (2)</li><li>Immunisation records</li></ul>",
      },
    ],
  });
  console.log("✅ Page content seeded");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
