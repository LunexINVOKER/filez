import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query(
    "INSERT INTO folders (name) VALUES " +
    "('Documents'), ('Photos'), ('Music')"
  );

  await db.query(
    "INSERT INTO files (name, size, folder_id) VALUES " +
    "('resume.pdf', 2048, 1), " +
    "('notes.txt', 512, 1), " +
    "('report.docx', 4096, 1), " +
    "('budget.xlsx', 1024, 1), " +
    "('todo.md', 256, 1), " +
    "('vacation.jpg', 8192, 2), " +
    "('selfie.png', 6144, 2), " +
    "('sunset.jpg', 7168, 2), " +
    "('dog.png', 5120, 2), " +
    "('family.jpg', 9216, 2), " +
    "('song1.mp3', 10240, 3), " +
    "('song2.mp3', 11264, 3), " +
    "('album.flac', 51200, 3), " +
    "('podcast.mp3', 20480, 3), " +
    "('beat.wav', 30720, 3)"
  );
}