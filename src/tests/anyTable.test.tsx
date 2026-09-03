import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { AnyTable } from "../components/AnyTable";
import { AnyTableThemeProvider } from "../theme/themeContext";

describe("<AnyTable /> Component", () => {
  const users = [
    { id: "1", name: "Ahmed", role: "admin", active: true },
    { id: "2", name: "Sara", role: "driver", active: false },
  ];

  it("Renders table title and headers", () => {
    render(
      <AnyTable
        title="Active Users"
        data={users}
        columns={[
          { key: "name", title: "User Name" },
          { key: "role", title: "User Role" },
        ]}
      />
    );

    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("User Name")).toBeInTheDocument();
    expect(screen.getByText("User Role")).toBeInTheDocument();
    expect(screen.getByText("Ahmed")).toBeInTheDocument();
    expect(screen.getByText("Sara")).toBeInTheDocument();
  });

  it("Fires action onClick callbacks with row object", async () => {
    const handleEdit = vi.fn();

    render(
      <AnyTable
        data={users}
        columns={[{ key: "name", title: "Name" }]}
        actions={[
          {
            id: "edit",
            label: "Edit",
            onClick: handleEdit,
          },
        ]}
      />
    );

    const editButtons = screen.getAllByText("Edit");
    expect(editButtons.length).toBe(2);

    await act(async () => {
      fireEvent.click(editButtons[0]);
    });

    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit.mock.calls[0][0]).toEqual(users[0]);
  });

  it("Renders action buttons with icons and handles clicks", async () => {
    const handleAction = vi.fn();

    render(
      <AnyTable
        data={users}
        columns={[{ key: "name", title: "Name" }]}
        actions={[
          {
            id: "details",
            label: "Details",
            icon: <span data-testid="test-icon">🔍</span>,
            onClick: handleAction,
          },
          {
            id: "icon-only",
            icon: (row) => <span data-testid={`dyn-icon-${row.id}`}>⚙️</span>,
            tooltip: "Settings",
            onClick: handleAction,
          },
        ]}
      />
    );

    const icons = screen.getAllByTestId("test-icon");
    expect(icons.length).toBe(2);

    const dynIcon = screen.getByTestId("dyn-icon-1");
    expect(dynIcon).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(icons[0]);
    });

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("Accepts react-icons Component directly, image URLs, and emojis as action icons", () => {
    // Component definition like react-icons (IconType)
    function FiCustomEdit(props: any) {
      return <svg data-testid="react-icon-comp" className={props.className} />;
    }

    render(
      <AnyTable
        data={users}
        columns={[{ key: "name", title: "Name" }]}
        actions={[
          // 1. Direct Component from react-icons (without instantiating <... />)
          {
            id: "comp-icon",
            label: "Edit",
            icon: FiCustomEdit,
            onClick: vi.fn(),
          },
          // 2. Image URL string
          {
            id: "img-icon",
            icon: "/icons/avatar.svg",
            onClick: vi.fn(),
          },
          // 3. Emoji string
          {
            id: "emoji-icon",
            icon: "🔥",
            onClick: vi.fn(),
          },
        ]}
      />
    );

    // Verify react-icons Component rendered
    const compIcons = screen.getAllByTestId("react-icon-comp");
    expect(compIcons.length).toBe(2);

    // Verify image url rendered as <img>
    const imgIcons = screen.getAllByRole("img");
    expect(imgIcons.length).toBe(2);
    expect(imgIcons[0]).toHaveAttribute("src", "/icons/avatar.svg");

    // Verify emoji rendered
    expect(screen.getAllByText("🔥").length).toBe(2);
  });

  it("Renders Switch action and triggers onChange", async () => {
    const handleToggle = vi.fn();

    render(
      <AnyTable
        data={users}
        columns={[{ key: "name", title: "Name" }]}
        actions={[
          {
            id: "status-switch",
            type: "switch",
            label: "Status",
            checked: (row) => row.active,
            onChange: handleToggle,
          },
        ]}
      />
    );

    const switches = screen.getAllByRole("switch");
    expect(switches.length).toBe(2);
    expect(switches[0]).toHaveAttribute("aria-checked", "true");
    expect(switches[1]).toHaveAttribute("aria-checked", "false");

    await act(async () => {
      fireEvent.click(switches[0]);
    });

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle.mock.calls[0][0]).toEqual(users[0]);
    expect(handleToggle.mock.calls[0][1]).toBe(false); // toggles from true to false
  });

  it("Renders empty state when data array is empty", () => {
    render(
      <AnyTable
        data={[]}
        columns={[{ key: "name", title: "Name" }]}
        emptyTitle="No users found"
      />
    );

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  it("Renders graceful error state with automated retry button on API failure", async () => {
    let callCount = 0;
    const fetcher = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error("Server Error 500: Internal Server Error"));
      }
      return Promise.resolve({
        data: [{ id: "1", name: "Recovered User" }],
        meta: { total: 1, page: 1, pageSize: 10 },
      });
    });

    render(
      <AnyTable
        api={{ fetcher }}
        columns={[{ key: "name", title: "Name" }]}
      />
    );

    // Verify error state is rendered
    expect(await screen.findByText("Unable to load data")).toBeInTheDocument();
    expect(
      screen.getByText("Server Error 500: Internal Server Error")
    ).toBeInTheDocument();

    // Verify Retry button exists
    const retryBtn = screen.getByRole("button", { name: /Retry Request/i });
    expect(retryBtn).toBeInTheDocument();

    // Click retry
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    // Verify recovered data is displayed
    expect(await screen.findByText("Recovered User")).toBeInTheDocument();
  });

  it("Supports custom errorComponent function with error and retry arguments", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("Network Failure 503"));

    render(
      <AnyTable
        api={{ fetcher }}
        columns={[{ key: "name", title: "Name" }]}
        errorComponent={(err, retry) => (
          <div data-testid="custom-error">
            <span>Custom: {err.message}</span>
            <button onClick={retry}>Custom Retry</button>
          </div>
        )}
      />
    );

    expect(await screen.findByTestId("custom-error")).toBeInTheDocument();
    expect(screen.getByText("Custom: Network Failure 503")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Custom Retry" })).toBeInTheDocument();
  });

  it("Inherits global styling from AnyTableThemeProvider across tables", () => {
    const { container } = render(
      <AnyTableThemeProvider
        theme={{
          classes: {
            tableWrapper: "global-custom-table-wrapper",
          },
        }}
      >
        <AnyTable
          data={users}
          columns={[{ key: "name", title: "Name" }]}
        />
      </AnyTableThemeProvider>
    );

    expect(container.querySelector(".global-custom-table-wrapper")).toBeInTheDocument();
  });

  it("Applies built-in visual presets like 'ocean' and 'midnight'", () => {
    const { container: oceanContainer } = render(
      <AnyTable
        data={users}
        preset="ocean"
        columns={[{ key: "name", title: "Name" }]}
      />
    );

    // Verify sky / ocean classes applied to table wrapper
    expect(oceanContainer.querySelector(".border-sky-500\\/20")).toBeInTheDocument();

    const { container: midnightContainer } = render(
      <AnyTable
        data={users}
        preset="midnight"
        columns={[{ key: "name", title: "Name" }]}
      />
    );

    // Verify midnight indigo classes applied
    expect(midnightContainer.querySelector(".bg-\\[\\#090D16\\]")).toBeInTheDocument();
  });

  it("Supports granular manual customization: custom borders, headerClassName, and dynamic rowClassName", () => {
    const { container } = render(
      <AnyTable
        data={users}
        columns={[{ key: "name", title: "Name" }]}
        headerClassName="ultra-custom-header-class"
        rowClassName={(row) => (row.active ? "row-is-active" : "row-is-inactive")}
        theme={{
          borderRadius: "4px",
          colors: {
            border: "#ef4444",
            primary: "#8b5cf6",
          },
          classes: {
            searchInput: "ultra-custom-search-input",
          },
        }}
      />
    );

    // Verify custom header class applied
    expect(container.querySelector(".ultra-custom-header-class")).toBeInTheDocument();

    // Verify dynamic rowClassName applied to rows based on row data
    expect(container.querySelector(".row-is-active")).toBeInTheDocument();
    expect(container.querySelector(".row-is-inactive")).toBeInTheDocument();

    // Verify custom input class applied
    expect(container.querySelector(".ultra-custom-search-input")).toBeInTheDocument();

    // Verify CSS variables for radius and border injected
    const wrapper = container.querySelector(".any-table-wrapper");
    expect(wrapper).toHaveStyle({ "--any-table-radius": "4px" });
  });
});


