"use client";
import React, { useEffect, useId, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";

export const Cover = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState<number[]>([]);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current.clientWidth ?? 0);
      const height = ref.current.clientHeight ?? 0;
      const numberOfBeams = Math.floor(height / 10);
      const positions = Array.from(
        { length: numberOfBeams },
        (_, i) => (i + 1) * (height / (numberOfBeams + 1))
      );
      setBeamPositions(positions);
    }
  }, []);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className="relative hover:bg-neutral-900 group/cover inline-block dark:bg-neutral-900 bg-neutral-100 px-2 py-2 transition duration-200 rounded-sm"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.2 } }}
            className="absolute inset-0 h-full w-full overflow-hidden rounded-sm"
          >
            <motion.div
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 h-full w-full"
            >
              <SparklesCore
                id="cover-sparkles"
                background="transparent"
                minSize={0.4}
                maxSize={2}
                particleDensity={500}
                className="h-full w-full"
                particleColor="#ffffff"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {beamPositions.map((position, index) => (
        <Beam
          key={index}
          hovered={hovered}
          duration={Math.random() * 2 + 1}
          delay={Math.random() * 2 + 1}
          width={containerWidth}
        />
      ))}
      <motion.span
        key={String(hovered)}
        animate={{
          scale: hovered ? 1.1 : 1,
          x: hovered ? [0, -2, 2, 0] : 0,
          y: hovered ? [0, 2, -2, 0] : 0,
        }}
        exit={{ filter: "none", scale: 1, x: 0, y: 0 }}
        transition={{ duration: 0.2, x: { duration: 0.2, repeat: Infinity, repeatType: "loop" }, y: { duration: 0.2, repeat: Infinity, repeatType: "loop" } }}
        className={cn(
          "inline-block relative z-20 dark:text-white text-neutral-900 group-hover/cover:text-white transition duration-200",
          className
        )}
      >
        {children}
      </motion.span>
      <CircleIcon className="absolute -right-[2px] -top-[2px]" />
      <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
      <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
      <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
    </div>
  );
};

export const Beam = ({
  className,
  delay,
  duration,
  hovered,
  width = 600,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  hovered?: boolean;
  width?: number;
}) => {
  const id = useId();

  return (
    <motion.svg
      width={width ?? "600"}
      height="1"
      viewBox={`0 0 ${width ?? "600"} 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-x-0 w-full", className)}
    >
      <motion.line
        x1="0"
        x2={width ?? "600"}
        y1="0.5"
        y2="0.5"
        stroke={`url(#${id})`}
        strokeOpacity="0.2"
      />
      <defs>
        <motion.linearGradient
          id={id}
          initial={{ x1: "0%", x2: hovered ? "-10%" : "-5%", y1: 0, y2: 0 }}
          animate={{ x1: "110%", x2: hovered ? "100%" : "105%", y1: 0, y2: 0 }}
          transition={{
            duration: hovered ? 0.5 : (duration ?? 2),
            ease: "linear",
            repeat: Infinity,
            delay: delay ?? 1,
            repeatDelay: Math.random() * 2,
          }}
        >
          <stop stopColor="#2EB9DF" stopOpacity="0" />
          <stop stopColor="#2EB9DF" />
          <stop offset="1" stopColor="#9E00FF" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

export const CircleIcon = ({
  className,
  delay,
}: {
  className?: string;
  delay?: number;
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none animate-pulse group-hover/cover:hidden h-2 w-2 rounded-full bg-neutral-600 dark:bg-white opacity-20 group-hover/cover:opacity-100",
        className
      )}
      style={{ animationDelay: `${delay ?? 0}s` }}
    />
  );
};
