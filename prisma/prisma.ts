import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to create a date for today with a specific time
function timeToday(hours: number, minutes: number, seconds: number = 0): Date {
  const d = new Date('2025-07-22'); // Using a fixed date for consistency
  d.setHours(hours, minutes, seconds);
  return d;
}

async function main() {
  console.log(`Start seeding ...`);

  // 1. Clean up existing data
  await prisma.incident.deleteMany();
  await prisma.camera.deleteMany();
  console.log('Deleted existing data.');

  // 2. Create Cameras
  const camerasData = [
    { id: 'cam1', name: 'Shop Floor Camera A', location: 'Shop Floor A' },
    { id: 'cam2', name: 'Vault Camera', location: 'Vault' },
    { id: 'cam3', name: 'Entrance Camera', location: 'Entrance' },
  ];
  await prisma.camera.createMany({
    data: camerasData,
  });
  console.log(`Created ${camerasData.length} cameras.`);

  // 3. Create Incidents
  const incidentsData = [
    // Unresolved Incidents
    { type: 'Unauthorised Access', tsStart: timeToday(14, 35, 37), tsEnd: timeToday(14, 37, 12), thumbnailUrl: '/thumbnails/thumb_ua_1.jpg', resolved: false, cameraId: 'cam1' },
    { type: 'Gun Threat', tsStart: timeToday(14, 35, 14), tsEnd: timeToday(14, 36, 5), thumbnailUrl: '/thumbnails/thumb_gun_1.jpg', resolved: false, cameraId: 'cam1' },
    { type: 'Unauthorised Access', tsStart: timeToday(14, 35, 1), tsEnd: timeToday(14, 35, 55), thumbnailUrl: '/thumbnails/thumb_ua_2.jpg', resolved: false, cameraId: 'cam1' },
    { type: 'Unauthorised Access', tsStart: timeToday(14, 34, 40), tsEnd: timeToday(14, 35, 10), thumbnailUrl: '/thumbnails/thumb_ua_3.jpg', resolved: false, cameraId: 'cam1' },
    { type: 'Unauthorised Access', tsStart: timeToday(14, 33, 50), tsEnd: timeToday(14, 34, 20), thumbnailUrl: '/thumbnails/thumb_ua_4.jpg', resolved: false, cameraId: 'cam1' },
    
    // More unresolved incidents for other cameras
    { type: 'Face Recognised', tsStart: timeToday(14, 40, 0), tsEnd: timeToday(14, 40, 30), thumbnailUrl: '/thumbnails/thumb_face_1.jpg', resolved: false, cameraId: 'cam2' },
    { type: 'Traffic Congestion', tsStart: timeToday(8, 15, 0), tsEnd: timeToday(8, 25, 0), thumbnailUrl: '/thumbnails/thumb_traffic_1.jpg', resolved: false, cameraId: 'cam3' },
    { type: 'Unauthorised Access', tsStart: timeToday(10, 5, 10), tsEnd: timeToday(10, 5, 45), thumbnailUrl: '/thumbnails/thumb_ua_5.jpg', resolved: false, cameraId: 'cam3' },
    { type: 'Gun Threat', tsStart: timeToday(22, 0, 0), tsEnd: timeToday(22, 1, 15), thumbnailUrl: '/thumbnails/thumb_gun_2.jpg', resolved: false, cameraId: 'cam2' },
    { type: 'Face Recognised', tsStart: timeToday(11, 30, 0), tsEnd: timeToday(11, 30, 25), thumbnailUrl: '/thumbnails/thumb_face_2.jpg', resolved: false, cameraId: 'cam1' },
    
    // Some resolved incidents
    { type: 'Unauthorised Access', tsStart: timeToday(2, 30, 0), tsEnd: timeToday(2, 31, 0), thumbnailUrl: '/thumbnails/thumb_ua_6.jpg', resolved: true, cameraId: 'cam2' },
    { type: 'Face Recognised', tsStart: timeToday(9, 0, 0), tsEnd: timeToday(9, 0, 15), thumbnailUrl: '/thumbnails/thumb_face_3.jpg', resolved: true, cameraId: 'cam3' },
    { type: 'Traffic Congestion', tsStart: timeToday(18, 0, 0), tsEnd: timeToday(18, 10, 0), thumbnailUrl: '/thumbnails/thumb_traffic_2.jpg', resolved: true, cameraId: 'cam3' },
    { type: 'Unauthorised Access', tsStart: timeToday(19, 45, 15), tsEnd: timeToday(19, 46, 0), thumbnailUrl: '/thumbnails/thumb_ua_7.jpg', resolved: true, cameraId: 'cam1' },
    { type: 'Gun Threat', tsStart: timeToday(4, 12, 0), tsEnd: timeToday(4, 12, 45), thumbnailUrl: '/thumbnails/thumb_gun_3.jpg', resolved: true, cameraId: 'cam2' },
  ];
  await prisma.incident.createMany({
    data: incidentsData,
  });
  console.log(`Created ${incidentsData.length} incidents.`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });