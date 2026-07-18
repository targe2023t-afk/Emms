FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/EMMS.API/EMMS.API.csproj", "src/EMMS.API/"]
COPY ["src/EMMS.Application/EMMS.Application.csproj", "src/EMMS.Application/"]
COPY ["src/EMMS.Domain/EMMS.Domain.csproj", "src/EMMS.Domain/"]
COPY ["src/EMMS.Infrastructure/EMMS.Infrastructure.csproj", "src/EMMS.Infrastructure/"]
RUN dotnet restore "src/EMMS.API/EMMS.API.csproj"
COPY . .
WORKDIR "/src/src/EMMS.API"
RUN dotnet build "EMMS.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EMMS.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMMS.API.dll"]
