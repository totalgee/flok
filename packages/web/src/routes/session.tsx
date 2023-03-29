import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import Menu from "../components/menu";
import Mosaic from "../components/mosaic";
import ConfigureDialog from "../components/configure-dialog";
import { useToast } from "../hooks/use-toast";
import { store } from "../lib/utils";
import Editor from "../components/editor";
import Pane from "../components/pane";
import { Session } from "@flok/session";
import { Doc } from "yjs";

interface ISessionLoaderParams {
  name: string;
}

interface Pane {
  target: string;
  content: string;
}

const defaultTarget = "tidal";

export async function loader({ params }: { params: any }) {
  return { name: params.name };
}

export default function SessionPage() {
  const { name } = useLoaderData() as ISessionLoaderParams;

  const { toast } = useToast();

  const [session, setSession] = useState<Session | null>(null);
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [panes, setPanes] = useState<Pane[]>([
    { target: defaultTarget, content: "" },
  ]);

  useEffect(() => {
    if (!name) return;
    const doc = new Doc();
    const newSession = new Session(name, doc);
    setSession(newSession);

    const key = `session:${name}`;
    const settings = store.get(key);
    if (!settings) store.set(key, {});
    console.log("settings for", name, settings);
  }, [name]);

  useEffect(() => {
    setTimeout(() => {
      toast({
        description: "Connected to Flok server",
      });
    }, 500);
  }, [toast]);

  const handleViewLayoutAdd = () => {
    setPanes((prevPanes) => [
      ...prevPanes,
      { target: defaultTarget, content: "" },
    ]);
  };

  const handleViewLayoutRemove = () => {
    setPanes((prevPanes) => prevPanes.slice(0, -1));
  };

  const handleSessionConfigure = () => {
    setConfigureDialogOpen(true);
  };

  return (
    <>
      <Menu
        onViewLayoutAdd={handleViewLayoutAdd}
        onViewLayoutRemove={handleViewLayoutRemove}
        onSessionConfigure={handleSessionConfigure}
      />
      <ConfigureDialog
        open={configureDialogOpen}
        onOpenChange={(isOpen) => setConfigureDialogOpen(isOpen)}
      />
      <Mosaic
        items={panes.map((pane, i) => (
          <Pane key={i}>
            <Editor
              key={i}
              value={pane.content}
              autoFocus={i === 0}
              session={session}
              target={pane.target}
              id={`pane-${i}`}
              className="flex-grow"
            />
          </Pane>
        ))}
      />
    </>
  );
}