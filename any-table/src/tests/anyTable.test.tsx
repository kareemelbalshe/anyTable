import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AnyTable } from "../components/AnyTable";

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
});


