"use client";

import Image from "next/image";
...
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name ?? user.email}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:block text-sm text-muted">
                {user.name ?? user.email}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
