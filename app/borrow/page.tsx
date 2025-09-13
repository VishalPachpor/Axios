import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BorrowExplorer from "@/components/business/loan/borrow-explorer";
import Breadcrumb from "@/components/ui/breadcrumb";

// Disable prerendering for this page
export const dynamic = "force-dynamic";

export default function BorrowPage() {
  return (
    <div className="min-h-screen flex flex-col axios-gradient-bg">
      <Header />
      <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 flex items-start justify-center min-h-[calc(100vh-200px)] mt-20">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-6">
            <Breadcrumb items={[{ label: "Borrow" }]} />
          </div>
          <BorrowExplorer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
