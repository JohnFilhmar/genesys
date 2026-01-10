import RoomStudent from './room-student';

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {

  const { roomId } = await params;
  
  return <RoomStudent roomId={roomId} />;
}