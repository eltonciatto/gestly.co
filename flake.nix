{
  description = "Gestly - Sistema de Gestão de Agendamentos";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.pnpm
            docker
            docker-compose
          ];

          shellHook = ''
            echo "Gestly development environment"
            echo "Node.js $(node --version)"
            echo "pnpm $(pnpm --version)"
          '';
        };

        packages.default = pkgs.buildNpmPackage {
          name = "gestly";
          src = ./.;
          npmDepsHash = "sha256-0000000000000000000000000000000000000000000=";
          
          buildPhase = ''
            npm run build
          '';

          installPhase = ''
            mkdir -p $out
            cp -r dist $out/
          '';
        };
      }
    );
}