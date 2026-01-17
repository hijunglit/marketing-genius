export const loader = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return null;
};

export default function ContentsPage() {
  return (
    <div className="p-20">
      <header>
        <h1>컨텐츠</h1>
        <p>모든 컨텐츠를 확인하세요.</p>
      </header>
      <main></main>
    </div>
  );
}
