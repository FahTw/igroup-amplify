import { Prompt } from "next/font/google";
import type { LucideIcon } from "lucide-react"
import { Users } from "lucide-react"

const prompt = Prompt({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

type MemberDetail = { first_name?: string; last_name?: string; email?: string };
type RoleShape = { code?: string };

type CardProps = {
    username?: string;
    userDetail?: MemberDetail;
    userRole?: RoleShape;
    icon?: LucideIcon;
}

export default function MemberCard({ username = "it66070xxx", userDetail = {}, userRole = {}, icon: Icon = Users }: CardProps) {

    const removeMember = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/${username}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            credentials: 'include',
        })
        const data = await res.json();
        if (!data.success) {
            return alert('Failed to remove member.');
        }

        alert(`Member ${username} has been removed.`);
    }

  return (
    <div className="bg-white shadow-md w-auto rounded-lg overflow-hidden">
            <div className="flex justify-center items-center gap-2 pb-4 border-b border-gray-300 ">
                <Icon className="w-5 h-5" />
                <h2 className="text-blue-700">{username}</h2>
            </div>
            <div className={`${prompt.className} p-4`}>
                {/* <ul className="list-disc list-inside">
                    <li className="text-gray-700 list-none"><p className="font-bold">Name : </p>{userDetail.first_name} {userDetail.last_name}</li>
                </ul> */}
                <ul className="list-none p-0 m-0">
                    <li className="flex items-center">
                        <p className="font-semibold mx-1">Name :</p>
                        <span>{userDetail.first_name} {userDetail.last_name}</span>
                    </li>
                    <li className="flex items-center">
                        <p className="font-semibold mx-1">Email :</p>
                        <span>{userDetail.email}</span>
                    </li>
                    <li className="flex items-center">
                        <p className="font-semibold mx-1">Role :</p>
                        <span>{userRole.code}</span>
                    </li>
                    <li>
                        <button className="bg-red-500 py-1 px-2 text-white rounded my-3" onClick={removeMember}>Delete</button>
                    </li>
                </ul>

            </div>
    </div>
  )
}