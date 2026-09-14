import VideoCard from "@/components/video/videoCard/VideoCard";
import { useAuth } from "@/shared/hooks/useAuth";

const videos = [
  {
    thumbnail: "https://i.ytimg.com/vi/9jHgl7YjABU/hq720.jpg",
    title:
      "Building a GPT2 124M Inference Engine From Scratch | Super30 livestreams",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "1.7M",
    uploadedAt: "3 years ago",
    duration: "1:42:35",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/kCc8FmEb1nY/hq720.jpg",
    title: "Let's build GPT: from scratch, in code, spelled out.",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "7.6M",
    uploadedAt: "3 years ago",
    duration: "1:56:20",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/IHZwWFHWa-w/hq720.jpg",
    title: "Gradient descent, how neural networks learn",
    channelName: "3Blue1Brown",
    channelAvatar:
      "https://yt3.ggpht.com/ytc/AIdro_l4J3m8xQq7Kp3vM8mGxV9q5L2Y8w8bXkQx7Q=s68-c-k-c0x00ffffff-no-rj",
    views: "9M",
    uploadedAt: "8 years ago",
    duration: "20:33",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hq720.jpg",
    title: "Neural Networks Explained From Scratch",
    channelName: "3Blue1Brown",
    channelAvatar:
      "https://yt3.ggpht.com/ytc/AIdro_l4J3m8xQq7Kp3vM8mGxV9q5L2Y8w8bXkQx7Q=s68-c-k-c0x00ffffff-no-rj",
    views: "22M",
    uploadedAt: "8 years ago",
    duration: "19:13",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/wjZofJX0v4M/hq720.jpg",
    title: "Transformers, the tech behind LLMs",
    channelName: "3Blue1Brown",
    channelAvatar:
      "https://yt3.ggpht.com/ytc/AIdro_l4J3m8xQq7Kp3vM8mGxV9q5L2Y8w8bXkQx7Q=s68-c-k-c0x00ffffff-no-rj",
    views: "8.4M",
    uploadedAt: "2 years ago",
    duration: "26:41",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/eMlx5fFNoYc/hq720.jpg",
    title: "Attention in transformers, step-by-step",
    channelName: "3Blue1Brown",
    channelAvatar:
      "https://yt3.ggpht.com/ytc/AIdro_l4J3m8xQq7Kp3vM8mGxV9q5L2Y8w8bXkQx7Q=s68-c-k-c0x00ffffff-no-rj",
    views: "6.2M",
    uploadedAt: "2 years ago",
    duration: "26:52",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/VMj-3S1tku0/hq720.jpg",
    title: "But what is a Fourier series?",
    channelName: "3Blue1Brown",
    channelAvatar:
      "https://yt3.ggpht.com/ytc/AIdro_l4J3m8xQq7Kp3vM8mGxV9q5L2Y8w8bXkQx7Q=s68-c-k-c0x00ffffff-no-rj",
    views: "18M",
    uploadedAt: "9 years ago",
    duration: "24:47",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/spUNpyF58BY/hq720.jpg",
    title: "But what is the Fourier Transform?",
    channelName: "3Blue1Brown",
    channelAvatar:
      "https://yt3.ggpht.com/ytc/AIdro_l4J3m8xQq7Kp3vM8mGxV9q5L2Y8w8bXkQx7Q=s68-c-k-c0x00ffffff-no-rj",
    views: "12M",
    uploadedAt: "8 years ago",
    duration: "19:42",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/zjkBMFhNj_g/hq720.jpg",
    title: "Deep Dive into LLMs like ChatGPT",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "5.9M",
    uploadedAt: "1 year ago",
    duration: "3:31:24",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/VMj-3S1tku0/hq720.jpg",
    title: "Let's reproduce GPT-2 (124M)",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "1M",
    uploadedAt: "2 years ago",
    duration: "4:01:26",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/zduSFxRajkE/hq720.jpg",
    title: "Let's build the GPT Tokenizer",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "1.1M",
    uploadedAt: "2 years ago",
    duration: "2:13:35",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/PaCmpygFfXo/hq720.jpg",
    title: "Building makemore Part 1: Bigram Language Model",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "1.2M",
    uploadedAt: "4 years ago",
    duration: "1:58:21",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/TCH_1BHY58I/hq720.jpg",
    title: "Building makemore Part 2: MLP",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "850K",
    uploadedAt: "4 years ago",
    duration: "1:55:14",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/P6sfmUTpUmc/hq720.jpg",
    title: "Building makemore Part 3: Activations & Gradients",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "620K",
    uploadedAt: "4 years ago",
    duration: "1:54:02",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/q8SA3rM6ckI/hq720.jpg",
    title: "Building makemore Part 4: Becoming a Backprop Ninja",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "330K",
    uploadedAt: "4 years ago",
    duration: "1:55:24",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/Tk5EFw2Vbh4/hq720.jpg",
    title: "Building makemore Part 5: Building a WaveNet",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "265K",
    uploadedAt: "4 years ago",
    duration: "56:22",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/VMj-3S1tku0/hq720.jpg",
    title: "A Deep Dive into Neural Networks",
    channelName: "Andrej Karpathy",
    channelAvatar:
      "https://yt3.ggpht.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s68-c-k-c0x00ffffff-no-rj",
    views: "2.1M",
    uploadedAt: "3 years ago",
    duration: "1:22:18",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/kCc8FmEb1nY/hq720.jpg",
    title: "How Transformers Actually Work",
    channelName: "AI Explained",
    channelAvatar: "https://i.pravatar.cc/100?img=12",
    views: "3.4M",
    uploadedAt: "1 year ago",
    duration: "28:14",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/hq720.jpg",
    title: "Learn Python - Full Course for Beginners",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "40M",
    uploadedAt: "6 years ago",
    duration: "4:26:52",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/8DvywoWv6fI/hq720.jpg",
    title: "Python Programming Full Course",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "12M",
    uploadedAt: "4 years ago",
    duration: "12:00:00",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/UB1O30fR-EE/hq720.jpg",
    title: "HTML Crash Course For Absolute Beginners",
    channelName: "Traversy Media",
    channelAvatar: "https://i.pravatar.cc/100?img=14",
    views: "3.2M",
    uploadedAt: "5 years ago",
    duration: "1:00:41",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/hdI2bqOjy3c/hq720.jpg",
    title: "JavaScript Tutorial for Beginners",
    channelName: "Programming with Mosh",
    channelAvatar: "https://i.pravatar.cc/100?img=15",
    views: "12M",
    uploadedAt: "6 years ago",
    duration: "1:00:19",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/hq720.jpg",
    title: "Learn JavaScript - Full Course for Beginners",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "18M",
    uploadedAt: "5 years ago",
    duration: "3:41:31",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/hq720.jpg",
    title: "React Tutorial for Beginners",
    channelName: "Programming with Mosh",
    channelAvatar: "https://i.pravatar.cc/100?img=15",
    views: "4.8M",
    uploadedAt: "2 years ago",
    duration: "1:36:54",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/Ke90Tje7VS0/hq720.jpg",
    title: "React JS Full Course for Beginners",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "9.1M",
    uploadedAt: "4 years ago",
    duration: "11:55:27",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/nu_pCVPKzTk/hq720.jpg",
    title: "TypeScript Full Course for Beginners",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "2.8M",
    uploadedAt: "3 years ago",
    duration: "5:16:25",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/Oe421EPjeBE/hq720.jpg",
    title: "Node.js and Express.js - Full Course",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "4.2M",
    uploadedAt: "3 years ago",
    duration: "8:16:00",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/ldwlOzRvYOU/hq720.jpg",
    title: "Git and GitHub for Beginners",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "6.5M",
    uploadedAt: "4 years ago",
    duration: "1:48:16",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/hq720.jpg",
    title: "JavaScript Full Course for Beginners",
    channelName: "Programming with Mosh",
    channelAvatar: "https://i.pravatar.cc/100?img=15",
    views: "8.7M",
    uploadedAt: "7 years ago",
    duration: "8:53:00",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/mU6anWqZJcc/hq720.jpg",
    title: "HTML & CSS Full Course - Beginner to Pro",
    channelName: "SuperSimpleDev",
    channelAvatar: "https://i.pravatar.cc/100?img=16",
    views: "11M",
    uploadedAt: "3 years ago",
    duration: "6:31:24",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/G3e-cpL7ofc/hq720.jpg",
    title: "HTML & CSS Full Course",
    channelName: "SuperSimpleDev",
    channelAvatar: "https://i.pravatar.cc/100?img=16",
    views: "14M",
    uploadedAt: "2 years ago",
    duration: "6:00:00",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/1Rs2ND1ryYc/hq720.jpg",
    title: "CSS Tutorial - Zero to Hero",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "5.6M",
    uploadedAt: "5 years ago",
    duration: "11:00:00",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/Qhaz36TZG5Y/hq720.jpg",
    title: "Tailwind CSS Full Course",
    channelName: "Dave Gray",
    channelAvatar: "https://i.pravatar.cc/100?img=17",
    views: "1.1M",
    uploadedAt: "2 years ago",
    duration: "3:12:44",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hq720.jpg",
    title: "Machine Learning Explained Visually",
    channelName: "3Blue1Brown",
    channelAvatar: "https://i.pravatar.cc/100?img=18",
    views: "7.8M",
    uploadedAt: "7 years ago",
    duration: "31:12",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/Ilg3g-GewQ5/hq720.jpg",
    title: "The Mathematics Behind Neural Networks",
    channelName: "3Blue1Brown",
    channelAvatar: "https://i.pravatar.cc/100?img=18",
    views: "4.5M",
    uploadedAt: "6 years ago",
    duration: "22:18",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/kCc8FmEb1nY/hq720.jpg",
    title: "Understanding Large Language Models",
    channelName: "Andrej Karpathy",
    channelAvatar: "https://i.pravatar.cc/100?img=19",
    views: "3.1M",
    uploadedAt: "2 years ago",
    duration: "1:12:42",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/zjkBMFhNj_g/hq720.jpg",
    title: "How ChatGPT Works Under the Hood",
    channelName: "Andrej Karpathy",
    channelAvatar: "https://i.pravatar.cc/100?img=19",
    views: "2.7M",
    uploadedAt: "2 years ago",
    duration: "48:32",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/eMlx5fFNoYc/hq720.jpg",
    title: "Attention Is All You Need - Explained",
    channelName: "AI Coffee Break",
    channelAvatar: "https://i.pravatar.cc/100?img=20",
    views: "1.9M",
    uploadedAt: "3 years ago",
    duration: "35:21",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hq720.jpg",
    title: "Deep Learning Crash Course",
    channelName: "Fireship",
    channelAvatar: "https://i.pravatar.cc/100?img=21",
    views: "2.2M",
    uploadedAt: "1 year ago",
    duration: "18:42",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/hq720.jpg",
    title: "React in 100 Seconds",
    channelName: "Fireship",
    channelAvatar: "https://i.pravatar.cc/100?img=21",
    views: "5.4M",
    uploadedAt: "3 years ago",
    duration: "2:05",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/erEgovG9WBs/hq720.jpg",
    title: "Next.js in 100 Seconds",
    channelName: "Fireship",
    channelAvatar: "https://i.pravatar.cc/100?img=21",
    views: "3.7M",
    uploadedAt: "3 years ago",
    duration: "2:01",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/zJSY8tbf_ys/hq720.jpg",
    title: "JavaScript in 100 Seconds",
    channelName: "Fireship",
    channelAvatar: "https://i.pravatar.cc/100?img=21",
    views: "4.9M",
    uploadedAt: "4 years ago",
    duration: "2:25",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/rv3Yq-B8qp4/hq720.jpg",
    title: "TypeScript in 100 Seconds",
    channelName: "Fireship",
    channelAvatar: "https://i.pravatar.cc/100?img=21",
    views: "2.8M",
    uploadedAt: "3 years ago",
    duration: "2:18",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/Ke90Tje7VS0/hq720.jpg",
    title: "I Built a Full Stack App With React",
    channelName: "Traversy Media",
    channelAvatar: "https://i.pravatar.cc/100?img=22",
    views: "1.8M",
    uploadedAt: "2 years ago",
    duration: "2:14:32",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/Oe421EPjeBE/hq720.jpg",
    title: "Build a REST API With Node.js",
    channelName: "Traversy Media",
    channelAvatar: "https://i.pravatar.cc/100?img=22",
    views: "1.4M",
    uploadedAt: "2 years ago",
    duration: "1:42:19",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/ldwlOzRvYOU/hq720.jpg",
    title: "GitHub Actions Tutorial",
    channelName: "Traversy Media",
    channelAvatar: "https://i.pravatar.cc/100?img=22",
    views: "780K",
    uploadedAt: "1 year ago",
    duration: "44:18",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/hq720.jpg",
    title: "Python Projects for Beginners",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "3.8M",
    uploadedAt: "2 years ago",
    duration: "5:24:16",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/nu_pCVPKzTk/hq720.jpg",
    title: "TypeScript Full Course",
    channelName: "freeCodeCamp.org",
    channelAvatar: "https://i.pravatar.cc/100?img=13",
    views: "1.7M",
    uploadedAt: "2 years ago",
    duration: "5:16:25",
  },

  {
    thumbnail: "https://i.ytimg.com/vi/UB1O30fR-EE/hq720.jpg",
    title: "Build a Website With HTML CSS and JavaScript",
    channelName: "Traversy Media",
    channelAvatar: "https://i.pravatar.cc/100?img=22",
    views: "2.3M",
    uploadedAt: "4 years ago",
    duration: "2:31:47",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/mU6anWqZJcc/hq720.jpg",
    title: "Build and Deploy a Portfolio Website",
    channelName: "SuperSimpleDev",
    channelAvatar: "https://i.pravatar.cc/100?img=16",
    views: "4.1M",
    uploadedAt: "2 years ago",
    duration: "3:45:12",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/G3e-cpL7ofc/hq720.jpg",
    title: "Build a Modern YouTube Clone",
    channelName: "SuperSimpleDev",
    channelAvatar: "https://i.pravatar.cc/100?img=16",
    views: "2.6M",
    uploadedAt: "1 year ago",
    duration: "4:18:33",
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
