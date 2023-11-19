import Container from "@/components/Board/Container";
import { Item } from "@/components/Board/Item";
import { Navbar } from "@/components/Navbar";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  tv,
} from "@nextui-org/react";
import {
  AddToQueue,
  Move,
  Rocket,
  User,
  WifiOff,
} from "@styled-icons/boxicons-regular";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

const styles = tv({
  slots: {
    base: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
    card: "border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]",
    header: "gap-2 pb-0",
    body: "",
    iconWrapper:
      "flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500",
    title: "text-base font-semibold",
    description: "font-normal text-base text-default-500",
  },
});

const Home = () => {
  return (
    <div className="home-gradient">
      <Navbar />
      <div className="flex flex-col items-center py-10">
        <div className="h-[300px]">
          <AnimatedDemo />
        </div>

        <div className="shadow-tt z-10 w-full rounded-t-[100%] bg-purple-800 pt-2 shadow-black">
          <div className="shadow-tt z-[60] flex h-96 w-full flex-col gap-10 rounded-t-[100%] bg-purple-900 pt-20 text-center shadow-black">
            <div className="text-4xl font-bold">
              <div>Get stuff done</div>
              <div>
                with kana<span className="text-yellow-500">banana</span>
              </div>
            </div>
            <div className="-mt-8">
              <p className="text-lg">
                Organize Effortlessly, Anytime, Anywhere
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <Link href="/app">
                <Button
                  href="/app"
                  size="lg"
                  className="w-fit"
                  variant="solid"
                  color="primary"
                >
                  <Rocket size={20} />
                  Get Started
                </Button>
              </Link>
              <Link href="/app">
                <Button
                  href="/app"
                  size="lg"
                  className="w-fit"
                  variant="flat"
                  color="success"
                >
                  <User size={20} />
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="flex w-full max-w-[1280px] flex-col bg-slate-950 pb-10 pt-32 md:flex-row md:gap-8">
              <div className="h-fit w-full grow p-4 md:w-min">
                <FeatureCard
                  icon={<Move size={20} />}
                  title="Drag-and-Drop Simplicity"
                  description="Easily organize your tasks with a simple drag-and-drop interface. Managing your to-do list has never been more intuitive."
                />
              </div>
              <div className="h-fit w-full grow p-4 md:w-min">
                <FeatureCard
                  icon={<User size={20} />}
                  title="Your Workspace, Your Way"
                  description="Customize boards and columns to fit the unique flow of your projects. Create a space that truly reflects how you work."
                />
              </div>
              <div className="h-fit w-full grow p-4 md:w-min">
                <FeatureCard
                  icon={<WifiOff size={20} />}
                  title="Work Offline, Stay Updated"
                  description="Continue managing your tasks even without internet access. Sync up later when you're back online"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-gradient h-screen w-screen overflow-y-scroll">
      <Navbar />
      <div className="flex w-full flex-col items-center justify-center gap-20 lg:h-1/2 lg:flex-row">
        <div className="flex h-full flex-col items-end justify-center px-4 py-10 lg:w-1/2">
          <div className="flex flex-col gap-3 md:mt-52">
            <div className="text-4xl font-bold md:text-4xl lg:text-6xl">
              <div className="flex">
                Get stuff done
                <div className="animate-wiggle px-2">✅</div>
              </div>
              with kana<span className="text-yellow-500">banana</span>
            </div>
            <p className="text-lg">Organize Effortlessly, Anytime, Anywhere</p>

            <div className="flex gap-2">
              <Link href="/app">
                <Button
                  href="/app"
                  size="lg"
                  className="w-fit"
                  variant="solid"
                  color="primary"
                >
                  <Rocket size={20} />
                  Get Started
                </Button>
              </Link>
              <Link href="/app">
                <Button
                  href="/app"
                  size="lg"
                  className="w-fit"
                  variant="flat"
                  color="success"
                >
                  <User size={20} />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="-mt-20 flex h-full grow scale-50 items-center md:scale-75 lg:scale-100">
          <AnimatedDemo />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex w-full max-w-[1280px] flex-col pt-32 md:flex-row md:gap-8">
          <div className="h-fit w-full grow p-4 md:w-min">
            <FeatureCard
              icon={<Move size={20} />}
              title="Drag-and-Drop Simplicity"
              description="Easily organize your tasks with a simple drag-and-drop interface. Managing your to-do list has never been more intuitive."
            />
          </div>
          <div className="h-fit w-full grow p-4 md:w-min">
            <FeatureCard
              icon={<User size={20} />}
              title="Your Workspace, Your Way"
              description="Customize boards and columns to fit the unique flow of your projects. Create a space that truly reflects how you work."
            />
          </div>
          <div className="h-fit w-full grow p-4 md:w-min">
            <FeatureCard
              icon={<WifiOff size={20} />}
              title="Work Offline, Stay Updated"
              description="Continue managing your tasks even without internet access. Sync up later when you're back online"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) => {
  const slots = styles();
  return (
    <Card isBlurred className={slots.card()}>
      <CardHeader className={slots.header()}>
        <div className={slots.iconWrapper()}>{icon}</div>
        <p className={slots.title()}>{title}</p>
      </CardHeader>
      <CardBody className={slots.body()}>
        <p className={slots.description()}>{description}</p>
      </CardBody>
    </Card>
  );
};

const AnimatedDemo = () => {
  const delay = 1;
  const stiffness = 100;
  const duration = 0.5;
  const repeatType = "loop";
  const repeat = Infinity;
  const repeatDelay = 1;

  return (
    <div className="pointer-events-none -mt-20 w-full scale-75">
      <div className="relative -left-4 shadow-2xl shadow-black">
        <Container
          id={"test"}
          title={"Done"}
          description={"This is a description"}
        >
          <Item
            key={"test-0"}
            id={"test-0"}
            title={"Lorem ipsum"}
            description={"Dolor sit amet"}
          />
        </Container>
      </div>
      <div className="relative -top-40 left-3 z-50 shadow-2xl shadow-black">
        <Container
          id={"test"}
          title={"Todo"}
          description={"Tasks that are yet to go into development"}
        >
          <motion.div className="opacity-">
            <Item
              key={"test-1"}
              id={"test-1"}
              title={"Lorem ipsum dolor sit amet"}
              description={
                "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              }
            />
          </motion.div>
          <motion.div>
            <Item
              key={"test-0"}
              id={"test-0"}
              title={"Sign up for kanabanana"}
              description={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              }
            />
          </motion.div>
        </Container>
      </div>
      {/* <motion.div
        className="relative -left-[97.5%] top-[226%] z-50"
        animate={{
          // x: [0, 20, 0],
          y: [0, -122, 0],
          // rotate: [0, 5, 0],
          boxShadow: [
            "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
            "none",
          ],
        }}
        transition={{
          type: "spring",
          stiffness,
          duration: 10,
          repeatType,
          repeat,
          repeatDelay,
        }}
      >
        <div>
          <Item
            key={"test-0"}
            id={"test-0"}
            title={"Sign up for kanabanana"}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            }
          />
        </div>
      </motion.div> */}
    </div>
  );
};

export default Home;
