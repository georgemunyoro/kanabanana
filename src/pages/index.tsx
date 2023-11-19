import Container from "@/components/Board/Container";
import { Item } from "@/components/Board/Item";
import { Navbar } from "@/components/Navbar";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ScrollShadow,
  tv,
} from "@nextui-org/react";
import { Github } from "@styled-icons/boxicons-logos";
import {
  Envelope,
  Move,
  Rocket,
  User,
  WifiOff,
} from "@styled-icons/boxicons-regular";
import { motion } from "framer-motion";
import Link from "next/link";
import { type ReactNode } from "react";

const styles = tv({
  slots: {
    base: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
    card: "border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]",
    header: "gap-2 pb-0",
    body: "",
    iconWrapper:
      "flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500",
    title: "text-base font-semibold",
    description: "font-normal text-sm text-default-500",
  },
});

const Home = () => {
  return (
    <div className="home-gradient h-full overflow-hidden">
      <Navbar />
      <ScrollShadow className="h-full">
        <div className="flex h-full flex-col items-center px-4 py-10">
          <div className="flex flex-col items-center justify-center gap-4 pt-10 shadow-black sm:p-10 md:flex-row lg:gap-24">
            <div className="w-min md:w-fit">
              <div className="fold:text-center text-left text-4xl font-bold md:text-left md:text-5xl lg:text-6xl">
                Get stuff done
                <div>
                  with kana<span className="text-yellow-500">banana</span>
                </div>
              </div>
              <div className="fold:text-center text-left md:text-left">
                Organize Effortlessly, Anytime, Anywhere
              </div>
              <div className="flex w-full justify-start pt-8">
                <div className="fold:flex-row fold:justify-center fold:w-full flex flex-col items-start gap-2 md:items-start md:justify-start">
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
            <div className="fold:scale-75 h-[500px] scale-[60%] lg:scale-90">
              <AnimatedDemo />
            </div>
          </div>
          <div className="flex grow flex-col pb-48 pt-10 md:w-full md:flex-row lg:max-w-[1000px]">
            <motion.div className="h-fit w-full grow p-4 md:w-min">
              <FeatureCard
                icon={<Move size={20} />}
                title="Drag-and-Drop Simplicity"
                description="Easily organize your tasks with a simple drag-and-drop interface. Managing your to-do list has never been more intuitive."
              />
            </motion.div>
            <motion.div className="h-fit w-full grow p-4 md:w-min">
              <FeatureCard
                icon={<User size={20} />}
                title="Your Workspace, Your Way"
                description="Customize boards and columns to fit the unique flow of your projects. Create a space that truly reflects how you work."
              />
            </motion.div>
            <div className="h-fit w-full grow p-4 md:w-min">
              <FeatureCard
                icon={<WifiOff size={20} />}
                title="Work Offline, Stay Updated"
                description="Continue managing your tasks even without internet access. Sync up later when you're back online"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-center self-end border-t-1 border-gray-800 bg-black p-4 pb-20">
            <Link href="https://github.com/georgemunyoro/kanabanana">
              <Button variant="ghost" className="border-0">
                <Github size={20} />
              </Button>
            </Link>
            <Link href="mailto:george@munyoro.com">
              <Button variant="ghost" className="border-0">
                <Envelope size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </ScrollShadow>
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
    <Card isBlurred className={slots.card() + " hover:scale-105"}>
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
  return (
    <div className="pointer-events-none -mt-10 flex w-full flex-col items-center">
      <div className="relative -left-4 w-min shadow-2xl shadow-black">
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
      <div className="relative -top-40 left-3 z-50 w-min shadow-2xl shadow-black">
        <Container
          id={"test"}
          title={"Todo"}
          description={"Tasks that are yet to go into development"}
        >
          <Item
            key={"test-1"}
            id={"test-1"}
            title={"Lorem ipsum dolor sit amet"}
            description={
              "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            }
          />
          <Item
            key={"test-0"}
            id={"test-0"}
            title={"Sign up for kanabanana"}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            }
          />
        </Container>
      </div>
    </div>
  );
};

export default Home;
