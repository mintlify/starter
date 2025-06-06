{
  description = "Development environment for IplanRio documentation";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        mintlify = pkgs.writeScriptBin "mintlify" ''
          #!${pkgs.bash}/bin/bash
          ${pkgs.nodejs_20}/bin/npx mintlify "$@"
        '';
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
            mintlify
          ];

          shellHook = ''
            echo "🚀 Mintlify development environment loaded"
            echo "Available commands:"
            echo "  - mintlify dev    : Start the development server"
            echo "  - mintlify install: Reinstall dependencies"
          '';
        };
      });
} 