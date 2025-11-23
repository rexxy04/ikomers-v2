import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  isDanger?: boolean;
}

// Pastikan ada "export default" di sini!
export default function ProfileMenu({ icon: Icon, label, href, onClick, isDanger }: Props) {
  const content = (
    <div className={`flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-3 shadow-sm hover:border-yellow-400 transition-colors cursor-pointer ${isDanger ? 'text-red-500' : 'text-gray-700'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isDanger ? 'bg-red-50' : 'bg-yellow-50'}`}>
          <Icon size={20} className={isDanger ? "text-red-500" : "text-yellow-600"} />
        </div>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
}