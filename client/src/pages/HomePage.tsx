import VideoCard from "@/components/video/videoCard/VideoCard";
import { useAuth } from "@/shared/hooks/useAuth";

const videos = [
  {
    thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hq720.jpg",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    channelName: "Luis Fonsi",
    channelAvatar: "https://i.pravatar.cc/100?img=2",
    views: "8.9B",
    uploadedAt: "9 years ago",
    duration: "4:42",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/RgKAFK5djSk/hq720.jpg",
    title: "Wiz Khalifa - See You Again ft. Charlie Puth",
    channelName: "Wiz Khalifa",
    channelAvatar: "https://i.pravatar.cc/100?img=3",
    views: "6.7B",
    uploadedAt: "10 years ago",
    duration: "3:58",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/aqz-KE-bpKQ/hq720.jpg",
    title: "Big Buck Bunny - Blender Open Movie",
    channelName: "Blender",
    channelAvatar: "https://i.pravatar.cc/100?img=5",
    views: "12M",
    uploadedAt: "16 years ago",
    duration: "9:56",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
    title: "Rick Astley - Never Gonna Give You Up",
    channelName: "Rick Astley",
    channelAvatar: "https://i.pravatar.cc/100?img=6",
    views: "1.7B",
    uploadedAt: "15 years ago",
    duration: "3:33",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hq720.jpg",
    title: "PSY - GANGNAM STYLE",
    channelName: "officialpsy",
    channelAvatar: "https://i.pravatar.cc/100?img=7",
    views: "5.5B",
    uploadedAt: "14 years ago",
    duration: "4:13",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/ysz5S6PUM-U/hq720.jpg",
    title: "24 Hours in the World's Most Incredible Hotel",
    channelName: "MrBeast",
    channelAvatar: "https://i.pravatar.cc/100?img=8",
    views: "82M",
    uploadedAt: "2 months ago",
    duration: "18:42",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/0e3GPea1Tyg/hq720.jpg",
    title: "$456,000 Squid Game In Real Life!",
    channelName: "MrBeast",
    channelAvatar: "https://i.pravatar.cc/100?img=8",
    views: "700M",
    uploadedAt: "4 years ago",
    duration: "25:42",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hq720.jpg",
    title: "But what is a Neural Network?",
    channelName: "3Blue1Brown",
    channelAvatar: "https://i.pravatar.cc/100?img=10",
    views: "22M",
    uploadedAt: "8 years ago",
    duration: "19:13",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/wjZofJX0v4M/hq720.jpg",
    title: "Transformers, the tech behind LLMs",
    channelName: "3Blue1Brown",
    channelAvatar: "https://i.pravatar.cc/100?img=10",
    views: "8.4M",
    uploadedAt: "2 years ago",
    duration: "26:41",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/7wtfhZwyrcc/hq720.jpg",
    title: "The Science of Black Holes",
    channelName: "Kurzgesagt – In a Nutshell",
    channelAvatar: "https://i.pravatar.cc/100?img=11",
    views: "45M",
    uploadedAt: "5 years ago",
    duration: "11:47",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/ysz5S6PUM-U/hq720.jpg",
    title: "The Most Beautiful Places on Earth",
    channelName: "National Geographic",
    channelAvatar: "https://i.pravatar.cc/100?img=12",
    views: "18M",
    uploadedAt: "1 year ago",
    duration: "14:28",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/hq720.jpg",
    title: "Exploring the World's Most Remote Islands",
    channelName: "National Geographic",
    channelAvatar: "https://i.pravatar.cc/100?img=12",
    views: "9.2M",
    uploadedAt: "8 months ago",
    duration: "21:36",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/LXb3EKWsInQ/hq720.jpg",
    title: "The Most Beautiful Beaches in the World",
    channelName: "Travel Vibes",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "4.8M",
    uploadedAt: "3 months ago",
    duration: "12:14",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/450p7goxZqg/hq720.jpg",
    title: "Marshmello - Alone",
    channelName: "Marshmello",
    channelAvatar: "https://i.pravatar.cc/100?img=15",
    views: "2.4B",
    uploadedAt: "10 years ago",
    duration: "3:20",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/fRh_vgS2dFE/hq720.jpg",
    title: "Justin Bieber - Sorry",
    channelName: "Justin Bieber",
    channelAvatar: "https://i.pravatar.cc/100?img=16",
    views: "3.9B",
    uploadedAt: "10 years ago",
    duration: "3:26",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hq720.jpg",
    title: "Top 10 Funniest Moments on the Internet",
    channelName: "Internet Historian",
    channelAvatar: "https://i.pravatar.cc/100?img=19",
    views: "12M",
    uploadedAt: "4 months ago",
    duration: "17:52",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/hq720.jpg",
    title: "India's Most Beautiful Train Journey",
    channelName: "Yes Theory",
    channelAvatar: "https://i.pravatar.cc/100?img=23",
    views: "5.2M",
    uploadedAt: "7 months ago",
    duration: "24:18",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/LXb3EKWsInQ/hq720.jpg",
    title: "We Spent 7 Days in the Himalayas",
    channelName: "Nomadic Ambience",
    channelAvatar: "https://i.pravatar.cc/100?img=24",
    views: "3.8M",
    uploadedAt: "4 months ago",
    duration: "32:46",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/ysz5S6PUM-U/hq720.jpg",
    title: "Champions League Highlights",
    channelName: "UEFA",
    channelAvatar: "https://i.pravatar.cc/100?img=25",
    views: "21M",
    uploadedAt: "2 days ago",
    duration: "9:42",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/hq720.jpg",
    title: "Best Goals of the Season",
    channelName: "ESPN",
    channelAvatar: "https://i.pravatar.cc/100?img=26",
    views: "7.9M",
    uploadedAt: "5 days ago",
    duration: "11:26",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/aqz-KE-bpKQ/hq720.jpg",
    title: "The Greatest Basketball Plays Ever",
    channelName: "NBA",
    channelAvatar: "https://i.pravatar.cc/100?img=27",
    views: "18M",
    uploadedAt: "3 weeks ago",
    duration: "14:52",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/kCc8FmEb1nY/hq720.jpg",
    title: "How AI Is Changing the World",
    channelName: "TED",
    channelAvatar: "https://i.pravatar.cc/100?img=28",
    views: "6.8M",
    uploadedAt: "6 months ago",
    duration: "17:34",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/wjZofJX0v4M/hq720.jpg",
    title: "The Future of Artificial Intelligence",
    channelName: "Lex Fridman Podcast",
    channelAvatar: "https://i.pravatar.cc/100?img=29",
    views: "4.3M",
    uploadedAt: "3 months ago",
    duration: "2:14:38",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hq720.jpg",
    title: "Why Do We Dream?",
    channelName: "Veritasium",
    channelAvatar: "https://i.pravatar.cc/100?img=30",
    views: "11M",
    uploadedAt: "8 months ago",
    duration: "18:27",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/hq720.jpg",
    title: "I Tried Living Like a Millionaire for 24 Hours",
    channelName: "Ryan Trahan",
    channelAvatar: "https://i.pravatar.cc/100?img=31",
    views: "15M",
    uploadedAt: "3 weeks ago",
    duration: "26:18",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/UB1O30fR-EE/hq720.jpg",
    title: "I Survived 7 Days in the Wilderness",
    channelName: "Outdoor Boys",
    channelAvatar: "https://i.pravatar.cc/100?img=32",
    views: "9.4M",
    uploadedAt: "1 month ago",
    duration: "41:52",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/hq720.jpg",
    title: "The Most Satisfying Video You'll Watch Today",
    channelName: "Zack D. Films",
    channelAvatar: "https://i.pravatar.cc/100?img=33",
    views: "24M",
    uploadedAt: "2 weeks ago",
    duration: "8:16",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/hq720.jpg",
    title: "I Tested Viral Gadgets So You Don't Have To",
    channelName: "Mrwhosetheboss",
    channelAvatar: "https://i.pravatar.cc/100?img=34",
    views: "10M",
    uploadedAt: "1 month ago",
    duration: "18:05",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/Ke90Tje7VS0/hq720.jpg",
    title: "The Weirdest Products You Can Buy Online",
    channelName: "Unbox Therapy",
    channelAvatar: "https://i.pravatar.cc/100?img=35",
    views: "5.6M",
    uploadedAt: "3 weeks ago",
    duration: "13:44",
  },
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <div>HomePage</div>;
  }

  return (
    <div className="h-full grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-x-4 gap-y-8 p-5">
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} />
      ))}
    </div>
  );

  // return (
  //   <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
  //     <div className="mx-auto max-w-lg">
  //       {/* Profile Card */}
  //       <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
  //         {/* Header Accent */}
  //         <div className="h-2 bg-primary" />

  //         <div className="p-6 sm:p-8">
  //           {/* User Header */}
  //           <div className="flex items-center gap-4">
  //             <div className="relative shrink-0">
  //               <img
  //                 src={user.avatarUrl}
  //                 alt={user.name}
  //                 className="h-20 w-20 rounded-full border-2 border-border object-cover"
  //               />

  //               {/* Online indicator */}
  //               <span
  //                 className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-surface ${
  //                   user.accountStatus === "active" ? "bg-success" : "bg-danger"
  //                 }`}
  //               />
  //             </div>

  //             <div className="min-w-0">
  //               <h1 className="truncate text-xl font-bold text-foreground">
  //                 {user.name}
  //               </h1>

  //               <p className="mt-1 truncate text-sm text-muted">
  //                 @{user.username}
  //               </p>
  //             </div>
  //           </div>

  //           {/* Divider */}
  //           <div className="my-6 border-t border-border" />

  //           {/* User Information */}
  //           <div className="space-y-4">
  //             <div className="rounded-md bg-surface-secondary p-3">
  //               <p className="text-xs font-medium uppercase tracking-wide text-subtle">
  //                 Email
  //               </p>

  //               <p className="mt-1 break-all text-sm text-foreground">
  //                 {user.email}
  //               </p>
  //             </div>

  //             <div className="flex items-center justify-between rounded-md bg-surface-secondary p-3">
  //               <div>
  //                 <p className="text-xs font-medium uppercase tracking-wide text-subtle">
  //                   Account Status
  //                 </p>

  //                 <p className="mt-1 text-sm font-medium text-foreground">
  //                   {user.accountStatus === "active" ? "Active" : "Inactive"}
  //                 </p>
  //               </div>

  //               <span
  //                 className={`rounded-full px-3 py-1 text-xs font-medium ${
  //                   user.accountStatus === "active"
  //                     ? "bg-success/10 text-success"
  //                     : "bg-danger/10 text-danger"
  //                 }`}
  //               >
  //                 {user.accountStatus}
  //               </span>
  //             </div>

  //             <div className="rounded-md bg-surface-secondary p-3">
  //               <p className="text-xs font-medium uppercase tracking-wide text-subtle">
  //                 Member Since
  //               </p>

  //               <p className="mt-1 text-sm text-foreground">
  //                 {new Date(user.createdAt).toLocaleDateString(undefined, {
  //                   year: "numeric",
  //                   month: "long",
  //                   day: "numeric",
  //                 })}
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </main>
  // );
};

export default HomePage;
