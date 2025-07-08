export default function Greet({ name }: { name: string }) {
  return (
    <div className="text-center text-2xl font-bold">
      Hello, {name}!
    </div>
  );
}