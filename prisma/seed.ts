import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to create a date for today
function timeToday(hours: number, minutes: number, seconds: number = 0): Date {
  const d = new Date('2025-07-22');
  d.setHours(hours, minutes, seconds);
  return d;
}

// Map incident types to their new thumbnail images
const incidentThumbnails: { [key: string]: string } = {
  'Unauthorised Access': '/thumbnails/unauthorizedaccess.jpg',
  'Gun Threat': '/thumbnails/gunthreat.jpg',
  'Face Recognised': '/thumbnails/facerecognition.jpg',
  'Traffic Congestion': '/thumbnails/trafficcongestion.jpg'
};

async function main() {
  console.log(`Start seeding ...`);

  await prisma.incident.deleteMany();
  await prisma.camera.deleteMany();
  console.log('Deleted existing data.');

  const camerasData = [
    { id: 'cam1', name: 'Shop Floor Camera A', location: 'Shop Floor A' },
    { id: 'cam2', name: 'Vault Camera', location: 'Vault' },
    { id: 'cam3', name: 'Entrance Camera', location: 'Entrance' },
  ];
  await prisma.camera.createMany({ data: camerasData });
  console.log(`Created ${camerasData.length} cameras.`);

  // The incident data now uses the map to get the correct thumbnail
  const incidentsData = [
    { type: 'Unauthorised Access', tsStart: timeToday(14, 35, 37), tsEnd: timeToday(14, 37, 12), thumbnailUrl: incidentThumbnails['Unauthorised Access'], resolved: false, cameraId: 'cam1' },
    { type: 'Gun Threat', tsStart: timeToday(14, 35, 14), tsEnd: timeToday(14, 36, 5), thumbnailUrl: incidentThumbnails['Gun Threat'], resolved: false, cameraId: 'cam1' },
    { type: 'Unauthorised Access', tsStart: timeToday(14, 35, 1), tsEnd: timeToday(14, 35, 55), thumbnailUrl: incidentThumbnails['Unauthorised Access'], resolved: false, cameraId: 'cam1' },
    { type: 'Unauthorised Access', tsStart: timeToday(14, 34, 40), tsEnd: timeToday(14, 35, 10), thumbnailUrl: incidentThumbnails['Unauthorised Access'], resolved: false, cameraId: 'cam1' },
    { type: 'Unauthorised Access', tsStart: timeToday(14, 33, 50), tsEnd: timeToday(14, 34, 20), thumbnailUrl: incidentThumbnails['Unauthorised Access'], resolved: false, cameraId: 'cam1' },
    { type: 'Face Recognised', tsStart: timeToday(14, 40, 0), tsEnd: timeToday(14, 40, 30), thumbnailUrl: incidentThumbnails['Face Recognised'], resolved: false, cameraId: 'cam2' },
    { type: 'Traffic Congestion', tsStart: timeToday(8, 15, 0), tsEnd: timeToday(8, 25, 0), thumbnailUrl: incidentThumbnails['Traffic Congestion'], resolved: false, cameraId: 'cam3' },
    { type: 'Unauthorised Access', tsStart: timeToday(10, 5, 10), tsEnd: timeToday(10, 5, 45), thumbnailUrl: incidentThumbnails['Unauthorised Access'], resolved: false, cameraId: 'cam3' },
    { type: 'Gun Threat', tsStart: timeToday(22, 0, 0), tsEnd: timeToday(22, 1, 15), thumbnailUrl: incidentThumbnails['Gun Threat'], resolved: false, cameraId: 'cam2' },
    { type: 'Face Recognised', tsStart: timeToday(11, 30, 0), tsEnd: timeToday(11, 30, 25), thumbnailUrl: incidentThumbnails['Face Recognised'], resolved: false, cameraId: 'cam1' },
    { type: 'Unauthorised Access', tsStart: timeToday(2, 30, 0), tsEnd: timeToday(2, 31, 0), thumbnailUrl: incidentThumbnails['Unauthorised Access'], resolved: true, cameraId: 'cam2' },
    { type: 'Face Recognised', tsStart: timeToday(9, 0, 0), tsEnd: timeToday(9, 0, 15), thumbnailUrl: incidentThumbnails['Face Recognised'], resolved: true, cameraId: 'cam3' },
    { type: 'Traffic Congestion', tsStart: timeToday(18, 0, 0), tsEnd: timeToday(18, 10, 0), thumbnailUrl: incidentThumbnails['Traffic Congestion'], resolved: true, cameraId: 'cam3' },
    { type: 'Unauthorised Access', tsStart: timeToday(19, 45, 15), tsEnd: timeToday(19, 46, 0), thumbnailUrl: incidentThumbnails['Unauthorised Access'], resolved: true, cameraId: 'cam1' },
    { type: 'Gun Threat', tsStart: timeToday(4, 12, 0), tsEnd: timeToday(4, 12, 45), thumbnailUrl: incidentThumbnails['Gun Threat'], resolved: true, cameraId: 'cam2' },
  ];
  await prisma.incident.createMany({ data: incidentsData });
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