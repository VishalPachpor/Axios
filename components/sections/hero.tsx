"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative pt-24 pb-20 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 min-h-screen flex items-center justify-center px-4 md:px-6 overflow-hidden"
      style={{
        background: `radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 1px)`,
        backgroundSize: "50px 50px",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      {/* Lightning SVG with absolute positioning */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-39.53px",
          top: "-495px",
          zIndex: 5,
        }}
      >
        <svg
          width="1613"
          height="1056"
          viewBox="0 0 1613 1056"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.3">
            <g filter="url(#filter0_f_153_109)">
              <path
                d="M915.205 481.096C893.827 439.609 909.64 388.211 950.518 366.298L1064.01 305.46C1104.89 283.547 1155.36 299.413 1176.74 340.899L1236.09 456.082C1257.47 497.569 1226.31 507.738 1185.42 529.655L1037.92 711.213C925.189 833.079 930.343 881.017 974.557 596.278L915.205 481.096Z"
                fill="url(#paint0_linear_153_109)"
              />
            </g>
            <g
              style={{ mixBlendMode: "overlay" }}
              filter="url(#filter1_f_153_109)"
            >
              <path
                d="M971.843 478.991C961.804 459.497 969.204 435.36 988.366 425.084L1041.58 396.544C1060.75 386.263 1084.43 393.733 1094.47 413.227L1122.34 467.35C1132.38 486.844 1117.77 491.609 1098.6 501.89L1019.69 617.543C670.732 1261.25 979.056 666.847 999.715 533.114L971.843 478.991Z"
                fill="url(#paint1_linear_153_109)"
              />
            </g>
            <g
              style={{ mixBlendMode: "overlay" }}
              filter="url(#filter2_f_153_109)"
            >
              <path
                d="M1100.54 230.588C1082.83 196.203 1095.93 153.605 1129.79 135.446L1223.81 85.0217C1257.67 66.8629 1299.48 80.0149 1317.18 114.4L1366.35 209.867C1384.05 244.252 1358.24 252.679 1324.37 270.842L1184.88 475.007C567.852 1611.25 1113.06 562.053 1149.7 326.055L1100.54 230.588Z"
                fill="url(#paint2_linear_153_109)"
              />
            </g>
            <g
              style={{ mixBlendMode: "overlay" }}
              filter="url(#filter3_f_153_109)"
            >
              <path
                d="M1106.29 210.075C1092.58 183.464 1102.72 150.5 1128.92 136.445L1201.66 97.4337C1227.87 83.3787 1260.22 93.5596 1273.92 120.171L1311.97 194.053C1325.68 220.664 1305.7 227.187 1279.5 241.238L1171.56 399.229C694.164 1278.5 1116 466.586 1144.34 283.957L1106.29 210.075Z"
                fill="url(#paint3_linear_153_109)"
              />
            </g>
          </g>
          <g opacity="0.3">
            <g filter="url(#filter4_f_153_109)">
              <path
                d="M349.603 452.661C328.225 411.174 344.038 359.776 384.916 337.863L498.406 277.025C539.284 255.112 589.757 270.978 611.135 312.465L670.487 427.647C691.865 469.135 660.704 479.303 619.817 501.22L472.321 682.779C359.587 804.644 364.741 852.583 408.955 567.844L349.603 452.661Z"
                fill="url(#paint4_linear_153_109)"
              />
            </g>
            <g
              style={{ mixBlendMode: "overlay" }}
              filter="url(#filter5_f_153_109)"
            >
              <path
                d="M406.24 450.556C396.201 431.062 403.601 406.926 422.763 396.649L475.978 368.11C495.148 357.829 518.825 365.299 528.864 384.793L556.736 438.916C566.775 458.41 552.165 463.174 532.995 473.455L454.087 589.108C105.13 1232.82 413.454 638.412 434.112 504.679L406.24 450.556Z"
                fill="url(#paint5_linear_153_109)"
              />
            </g>
            <g
              style={{ mixBlendMode: "overlay" }}
              filter="url(#filter6_f_153_109)"
            >
              <path
                d="M534.936 202.154C517.228 167.768 530.326 125.17 564.185 107.012L658.207 56.5871C692.065 38.4284 733.873 51.5804 751.58 85.9659L800.743 181.432C818.451 215.818 792.638 224.245 758.771 242.408L619.277 446.572C2.24954 1582.81 547.459 533.619 584.098 297.62L534.936 202.154Z"
                fill="url(#paint6_linear_153_109)"
              />
            </g>
            <g
              style={{ mixBlendMode: "overlay" }}
              filter="url(#filter7_f_153_109)"
            >
              <path
                d="M540.686 181.641C526.982 155.029 537.114 122.065 563.321 108.01L636.061 68.9991C662.268 54.9441 694.618 65.125 708.322 91.7364L746.369 165.618C760.073 192.229 740.093 198.753 713.895 212.803L605.961 370.795C128.562 1250.07 550.398 438.151 578.733 255.522L540.686 181.641Z"
                fill="url(#paint7_linear_153_109)"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_153_109"
              x="657.374"
              y="47.3026"
              width="833.959"
              height="1008.28"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="124.153"
                result="effect1_foregroundBlur_153_109"
              />
            </filter>
            <filter
              id="filter1_f_153_109"
              x="804.61"
              y="342.267"
              width="370.651"
              height="618.915"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="24.8306"
                result="effect1_foregroundBlur_153_109"
              />
            </filter>
            <filter
              id="filter2_f_153_109"
              x="867.57"
              y="52.028"
              width="529.353"
              height="966.73"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="12.4153"
                result="effect1_foregroundBlur_153_109"
              />
            </filter>
            <filter
              id="filter3_f_153_109"
              x="920.44"
              y="66.285"
              width="420.81"
              height="759.339"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="12.4153"
                result="effect1_foregroundBlur_153_109"
              />
            </filter>
            <filter
              id="filter4_f_153_109"
              x="91.7713"
              y="18.868"
              width="833.959"
              height="1008.28"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="124.153"
                result="effect1_foregroundBlur_153_109"
              />
            </filter>
            <filter
              id="filter5_f_153_109"
              x="239.008"
              y="313.833"
              width="370.651"
              height="618.915"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="24.8306"
                result="effect1_foregroundBlur_153_109"
              />
            </filter>
            <filter
              id="filter6_f_153_109"
              x="301.967"
              y="23.5935"
              width="529.353"
              height="966.73"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="12.4153"
                result="effect1_foregroundBlur_153_109"
              />
            </filter>
            <filter
              id="filter7_f_153_109"
              x="354.837"
              y="37.8504"
              width="420.81"
              height="759.339"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="12.4153"
                result="effect1_foregroundBlur_153_109"
              />
            </filter>
            <linearGradient
              id="paint0_linear_153_109"
              x1="1050.06"
              y1="365.678"
              x2="1158.59"
              y2="392.149"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.0001" stopColor="white" />
              <stop offset="0.461458" stopColor="white" />
              <stop offset="1" stopColor="#DD5713" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_153_109"
              x1="980.658"
              y1="478.799"
              x2="1087.59"
              y2="511.581"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.0001" stopColor="white" />
              <stop offset="1" stopColor="#DD5713" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_153_109"
              x1="1116.11"
              y1="230.238"
              x2="1304.82"
              y2="288.258"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.0001" stopColor="white" />
              <stop offset="0.461458" stopColor="white" />
              <stop offset="1" stopColor="#DD5713" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_153_109"
              x1="1118.34"
              y1="209.804"
              x2="1264.38"
              y2="254.691"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.0001" stopColor="white" />
              <stop offset="1" stopColor="#DD5713" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_153_109"
              x1="484.458"
              y1="337.244"
              x2="592.985"
              y2="363.715"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.0001" stopColor="white" />
              <stop offset="0.461458" stopColor="white" />
              <stop offset="1" stopColor="#DD5713" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_153_109"
              x1="415.055"
              y1="450.364"
              x2="521.983"
              y2="483.147"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.0001" stopColor="white" />
              <stop offset="1" stopColor="#DD5713" />
            </linearGradient>
            <linearGradient
              id="paint6_linear_153_109"
              x1="550.507"
              y1="201.803"
              x2="739.222"
              y2="259.823"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.0001" stopColor="white" />
              <stop offset="0.461458" stopColor="white" />
              <stop offset="1" stopColor="#DD5713" />
            </linearGradient>
            <linearGradient
              id="paint7_linear_153_109"
              x1="552.737"
              y1="181.369"
              x2="698.775"
              y2="226.256"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.0001" stopColor="white" />
              <stop offset="1" stopColor="#DD5713" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 z-10" />

      <div className="relative z-20 text-center max-w-6xl mx-auto w-full">
        {/* Main heading with large, impactful typography following UX best practices */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-foreground mb-8 md:mb-10 leading-[0.85] tracking-tight px-2">
          Fixed-Rate
          <br />
          Borrow & Lend on Fuel
        </h1>

        {/* Subtitle with improved readability and proper contrast */}
        <p className="text-body text-base md:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
          Predictable borrowing costs and steady yields.
          <br className="hidden sm:block" />
          Fixed-rate, fixed-duration credit—built natively on Fuel.
        </p>

        {/* Join Waitlist CTA Button */}
        <div className="flex justify-center items-center px-4 mb-6 md:mb-10">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground px-12 py-4 rounded-full font-medium transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-w-64"
          >
            <Link href="/waitlist#waitlist-section">
              Join the Waitlist
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Atmospheric effects */}
      <div className="absolute top-1/3 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
}
